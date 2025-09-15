
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPollById, votePoll } from '../apiCalls/poll';

interface Option {
  text: string;
  votes: number;
  _id?: string;
}

interface Poll {
  id: string;
  question: string;
  options: Option[];
}

function PollDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [message, setMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchPoll = async () => {
      try {
        setLoading(true);
        const data = await getPollById(id);
        setPoll(data);
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Failed to load poll');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id, navigate]);

  const handleVote = async (optionIndex: number) => {
    if (!id || hasVoted || voting) return;

    try {
      setVoting(true);
      setMessage('');
      
      const updatedPoll = await votePoll(id, optionIndex);
      setPoll(updatedPoll);
      setHasVoted(true);
      setMessage('Vote recorded successfully!');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to record vote');
    } finally {
      setVoting(false);
    }
  };

  const getTotalVotes = () => {
    if (!poll) return 0;
    return poll.options.reduce((total, option) => total + option.votes, 0);
  };

  const getVotePercentage = (votes: number) => {
    const total = getTotalVotes();
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {message || 'Poll not found'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Polls
        </button>
      </div>
    );
  }

  const totalVotes = getTotalVotes();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Polls
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{poll.question}</h1>
        <p className="text-gray-600">
          Total votes: <span className="font-semibold">{totalVotes}</span>
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('success') || message.includes('recorded')
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Options */}
      <div className="space-y-4">
        {poll.options.map((option, index) => {
          const percentage = getVotePercentage(option.votes);
          const isWinning = totalVotes > 0 && option.votes === Math.max(...poll.options.map(o => o.votes));
          
          return (
            <div
              key={index}
              className={`relative border-2 rounded-lg p-4 transition-all duration-200 ${
                hasVoted
                  ? `cursor-default ${isWinning ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'}`
                  : 'cursor-pointer border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onClick={() => !hasVoted && handleVote(index)}
            >
              {/* Progress bar background */}
              {hasVoted && (
                <div
                  className="absolute inset-0 bg-blue-100 rounded-lg transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              )}
              
              {/* Content */}
              <div className="relative z-10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium text-gray-800">
                    {option.text}
                  </span>
                  {isWinning && hasVoted && (
                    <span className="text-green-600 font-semibold text-sm">
                      Leading
                    </span>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">
                    {option.votes} vote{option.votes !== 1 ? 's' : ''}
                  </div>
                  {hasVoted && (
                    <div className="text-sm text-gray-600">
                      {percentage}%
                    </div>
                  )}
                </div>
              </div>
              
              {/* Vote button overlay for non-voted state */}
              {!hasVoted && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-blue-500 bg-opacity-10 rounded-lg">
                  <span className="text-blue-600 font-semibold">
                    {voting ? 'Voting...' : 'Click to Vote'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      {!hasVoted && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-center">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Click on an option to cast your vote
          </p>
        </div>
      )}

      {hasVoted && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-center">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Thank you for voting! Results are shown above.
          </p>
        </div>
      )}
    </div>
  );
}

export default PollDetail;