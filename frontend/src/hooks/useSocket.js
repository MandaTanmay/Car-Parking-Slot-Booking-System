import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Join parking lot room
  const joinParkingLot = (parkingLotId) => {
    if (socketRef.current) {
      socketRef.current.emit('join_parking_lot', parkingLotId);
    }
  };

  // Leave parking lot room
  const leaveParkingLot = (parkingLotId) => {
    if (socketRef.current) {
      socketRef.current.emit('leave_parking_lot', parkingLotId);
    }
  };

  // Subscribe to slot updates
  const onSlotUpdate = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('slot_update', callback);
    }
  };

  // Unsubscribe from slot updates
  const offSlotUpdate = (callback) => {
    if (socketRef.current) {
      socketRef.current.off('slot_update', callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinParkingLot,
    leaveParkingLot,
    onSlotUpdate,
    offSlotUpdate,
  };
};
