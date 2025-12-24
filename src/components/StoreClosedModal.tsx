import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface StoreClosedModalProps {
    isOpen: boolean;
    openingTime: string;
    closingTime: string;
    isTemporarilyClosed: boolean;
}

const StoreClosedModal: React.FC<StoreClosedModalProps> = ({
    isOpen,
    openingTime,
    closingTime,
    isTemporarilyClosed
}) => {
    if (!isOpen) return null;

    const formatTime = (time: string) => {
        if (!time) return '';
        const [h, m] = time.split(':');
        return new Date(2000, 0, 1, +h, +m).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-red-50 p-6 text-center border-b border-red-100">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        {isTemporarilyClosed ? (
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        ) : (
                            <Clock className="h-8 w-8 text-red-600" />
                        )}
                    </div>
                    <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                        {isTemporarilyClosed ? 'Store Temporarily Closed' : 'Store is Closed'}
                    </h2>
                    <p className="text-gray-600">
                        {isTemporarilyClosed
                            ? 'We are currently not accepting orders. Please check back later.'
                            : `Order taking is available daily from ${formatTime(openingTime)} to ${formatTime(closingTime)}.`}
                    </p>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500 mb-1">Current Status</p>
                            <p className="text-lg font-medium text-red-600">
                                Not Accepting Orders
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreClosedModal;
