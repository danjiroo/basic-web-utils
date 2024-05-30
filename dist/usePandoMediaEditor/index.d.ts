export declare const usePandoMediaEditor: (mediaElement: any) => {
    playerState: {
        isPlaying: boolean;
        progress: number;
        speed: number;
        isMuted: boolean;
    };
    togglePlay: () => void;
    handleOnTimeUpdate: () => void;
    handleVideoProgress: (event: any) => void;
    handleVideoSpeed: (event: any) => void;
    toggleMute: () => void;
    currentTimeStamp: () => {
        formattedTime: string;
        sec: number;
    };
    handleUpdateTimeStamp: (e: any) => void;
};
