import Sidebar from '../components/GeneralComponents/Sidebar'
import Searchbar from '../components/GeneralComponents/Searchbar'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'


const FriendList = () => {
    const { user } = useUser()
    const [friends, setFriends] = useState([])
    const [friendId, setFriendId] = useState()
    const [searchResults, setSearchResults] = useState([]); // Store search results
    const [showSearchModal, setShowSearchModal] = useState(false); // Control modal visibility
    const [message, setMessage] = useState(''); // Store API message
    const [showMessageModal, setShowMessageModal] = useState(false); // Control message modal visibility


    const searchUsers = async (query) => {
        console.log(`Searching for users: ${query}`);
        try {
            const response = await fetch(`http://localhost:8080/api/users/${query}`);
            const user = await response.json();
            console.log("searchUser ", user);
            if (!user.error) {
                setSearchResults([user]);
                setShowSearchModal(true);
            } else {
                setSearchResults([]);
                setShowSearchModal(true);
            }

        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleCloseModal = () => {
        setShowSearchModal(false); // Hide the modal
        setSearchResults([]); // Clear search results
    };

    const handleAddFriend = async (id) => {
        try {
            const result = await fetch('http://localhost:8080/api/users/addFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id, friendId: id }),
            })
            const data = await result.json()
            console.log(data)
            setMessage(data.message);
            setShowMessageModal(true);
        } catch (error) {
            setMessage(error)
            setShowMessageModal(true);
        }
    }

    const handleCloseMessageModal = () => {
        setShowMessageModal(false); // Hide the message modal
    };

    useEffect(() => {

        const fetchFriends = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users/relationships/${user.id}`);
                if (!response.ok) {
                    throw new Error(response.status);
                }
                const data = await response.json();
                if (data) {
                    setFriends(data);
                }

                //Debug
                console.log(friends);
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        }

        fetchFriends()
    }, [user]);



    return (
        <div className="flex h-screen">
            <div className="w-1/4 ml-60 bg-gray-200 overflow-y-auto">
                <Sidebar />
                <Searchbar onSearch={searchUsers} />

                {/* Friend List */}
                <div className="p-4 mt-8">
                    <h2 className="text-lg font-semibold mb-4">Friends</h2>
                    <ul>
                        {friends.map((friend) => (
                            <li
                                key={friend.clerkUserId}
                                className={`flex items-center p-2 cursor-pointer ${friendId === friend.clerkUserId ? "bg-gray-300" : "hover:bg-gray-100"}`}
                                onClick={() => setFriendId(friend.clerkUserId)}
                            >
                                <img src={friend.imageUrl} alt="User Avatar" className="rounded-full w-10 h-10 object-cover"></img>
                                <span className="ml-3 ">{friend.username}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Search Result */}
            {showSearchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Search Results</h2>
                            <button onClick={handleCloseModal} className="text-red-500 hover:text-gray-800">X</button>
                        </div>

                        {searchResults.length > 0 ? (
                            <ul>
                                {searchResults.map((result) => (
                                    <li
                                        key={result.user.clerkUserId}
                                        className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <img
                                            src={result.user.imageUrl}
                                            alt="User Avatar"
                                            className="rounded-full w-10 h-10 object-cover"
                                        />
                                        <span className="ml-3">{result.user.username}</span>
                                        <button onClick={() => handleAddFriend(result.user.clerkUserId)} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No user found.</p>
                        )}
                    </div>
                </div>
            )}

            {showMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Notification</h2>
                            <button onClick={handleCloseMessageModal} className="text-red-500 hover:text-gray-800">
                                X
                            </button>
                        </div>
                        <p className="text-gray-700">{message}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FriendList;