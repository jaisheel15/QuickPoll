import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPolls } from "../apiCalls/poll";

interface Poll {
  id: string | number;
  question: string;
  options: {
    text: string;
    votes: number;
    _id?: string;
  }[];
}

function PollList() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        async function fetchPolls() {
            try {
                setLoading(true);
                const data = await getAllPolls();
                setPolls(data);
            } catch (error) {
                console.error('Failed to fetch polls:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPolls();
    }, []);

    const handlePollClick = (pollId: string | number) => {
        navigate(`/polls/${pollId}`);
    };

    const getTotalVotes = (options: Poll['options']) => {
        return options.reduce((total, option) => total + option.votes, 0);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">QuickPolls</h1>
                    <p className="text-gray-600 mt-2">Loading polls...</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">QuickPolls</h1>
                <p className="text-gray-600">Click on any poll to view details and vote</p>
                
                {/* Create Poll Button */}
                <button
                    onClick={() => navigate('/create')}
                    className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold shadow-md"
                >
                    Create New Poll
                </button>
            </div>

            {polls.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-500 mb-2">No polls yet</h3>
                    <p className="text-gray-400 mb-4">Be the first to create a poll!</p>
                    <button
                        onClick={() => navigate('/create')}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Create First Poll
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {polls.map((poll) => {
                        const totalVotes = getTotalVotes(poll.options);
                        const topOption = poll.options.reduce((prev, current) => 
                            prev.votes > current.votes ? prev : current
                        );

                        return (
                            <div
                                key={poll.id}
                                onClick={() => handlePollClick(poll.id)}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1"
                            >
                                <div className="p-6">
                                    {/* Question */}
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2">
                                        {poll.question}
                                    </h3>
                                    
                                    {/* Options Preview */}
                                    <div className="space-y-2 mb-4">
                                        {poll.options.slice(0, 3).map((option, index) => (
                                            <div key={index} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600 truncate mr-2">
                                                    {option.text}
                                                </span>
                                                <span className="text-gray-500 font-medium whitespace-nowrap">
                                                    {option.votes} vote{option.votes !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        ))}
                                        {poll.options.length > 3 && (
                                            <div className="text-sm text-gray-400 italic">
                                                +{poll.options.length - 3} more option{poll.options.length - 3 !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Stats */}
                                    <div className="border-t pt-4 flex justify-between items-center text-sm">
                                        <div className="text-gray-500">
                                            <span className="font-medium">{totalVotes}</span> total vote{totalVotes !== 1 ? 's' : ''}
                                        </div>
                                        
                                        {totalVotes > 0 && (
                                            <div className="text-blue-600 font-medium">
                                                Leading: {topOption.text}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Click indicator */}
                                    <div className="mt-4 flex items-center justify-center text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Click to view details</span>
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default PollList;