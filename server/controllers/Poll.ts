import Poll from "../models/Poll";
import Vote from "../models/Vote";


export const newPoll = async (req, res) => {
  const { question, options } = req.body;
  
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    // Transform options to match schema format
    const formattedOptions = options.map(option => ({
      text: typeof option === 'string' ? option : option.text,
      votes: 0
    }));
    
    const new_Poll = {
      userId,
      question,
      options: formattedOptions,
    };
    
    console.log(new_Poll);
    
    const poll_new = await Poll.create(new_Poll);
    
    res.status(201).json({ poll: poll_new });
  } catch (error) {
    console.error('Poll creation error:', error);
    return res.status(500).json({ message: "Server error: ", error });
  }
};

export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    
    // Transform to the desired format
    const formattedPolls = polls.map(poll => ({
      id: poll._id,
      question: poll.question,
      options: poll.options
    }));
    
    res.status(200).json(formattedPolls);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export const votePoll = async (req, res) => {
    const pollId = req.params.id;
    const optionIndex = Number(req.body.optionIndex);
    const userId = req.userId;

    try {
        const poll = await Poll.findById(pollId);
        if(!poll){
            return res.status(404).json({message:"Poll not found"})
        }
        
        if(!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= poll.options.length){
            return res.status(400).json({message:"Invalid option index"})
        }

        // Check if user has already voted on this poll
        const existingVote = await Vote.findOne({ pollId, userId });
        if (existingVote) {
            return res.status(400).json({ message: "You have already voted on this poll" });
        }

        // Create the vote
        await Vote.create({pollId, userId, optionIndex});
        
        // Update poll option votes
        const updatedPoll = await Poll.findByIdAndUpdate(
            pollId,
            { $inc: { [`options.${optionIndex}.votes`]: 1 } },
            { new: true }
        );

        if (!updatedPoll) {
            return res.status(500).json({ error: 'Vote recorded but poll missing' });
        }

        return res.status(200).json(updatedPoll);
    } catch(error){
        console.error('Vote creation error:', error);
        return res.status(500).json({ message: "Server error: ", error });
    }
}