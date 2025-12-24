import React, { useState } from 'react';

interface RoomModalProps {
    isOpen: boolean;
    onSubmit: (roomNumber: string) => void;
}

const RoomModal: React.FC<RoomModalProps> = ({ isOpen, onSubmit }) => {
    const [roomNumber, setRoomNumber] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomNumber.trim()) {
            setError('Please enter your room number');
            return;
        }
        onSubmit(roomNumber);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all animate-scale-in">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-noto font-bold text-black mb-2">Welcome to Iskina Puso!</h2>
                    <p className="text-gray-600">Please enter your room number to start ordering.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Room Number</label>
                        <input
                            type="text"
                            value={roomNumber}
                            onChange={(e) => {
                                setRoomNumber(e.target.value);
                                setError('');
                            }}
                            className="w-full px-4 py-3 border border-iskina-green/30 rounded-lg focus:ring-2 focus:ring-iskina-green focus:border-transparent text-lg text-center font-medium placeholder-gray-400"
                            placeholder="e.g. 101"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl font-bold text-lg bg-iskina-green text-white hover:bg-iskina-dark transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Start Ordering
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RoomModal;
