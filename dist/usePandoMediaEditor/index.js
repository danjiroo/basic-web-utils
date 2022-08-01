"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePandoMediaEditor = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = require("react");
const usePandoMediaEditor = (mediaElement) => {
    const [playerState, setPlayerState] = (0, react_1.useState)({
        isPlaying: false,
        progress: 0,
        speed: 1,
        isMuted: false,
    });
    const togglePlay = () => {
        setPlayerState(Object.assign(Object.assign({}, playerState), { isPlaying: !playerState.isPlaying }));
    };
    (0, react_1.useEffect)(() => {
        if (mediaElement.current !== null)
            playerState.isPlaying
                ? mediaElement.current.play()
                : mediaElement.current.pause();
    }, [playerState.isPlaying, mediaElement, mediaElement.current]);
    const handleOnTimeUpdate = () => {
        if (mediaElement.current !== null) {
            const progress = (mediaElement.current.currentTime / mediaElement.current.duration) * 100;
            setPlayerState(Object.assign(Object.assign({}, playerState), { progress }));
        }
    };
    const handleVideoProgress = (event) => {
        const num = event.target.value;
        if (mediaElement.current !== null) {
            const manualChange = Number(num);
            mediaElement.current.currentTime =
                (mediaElement.current.duration / 100) * manualChange;
            setPlayerState(Object.assign(Object.assign({}, playerState), { progress: manualChange }));
        }
    };
    const handleVideoSpeed = (event) => {
        if (mediaElement.current !== null) {
            const speed = Number(event.target.value);
            mediaElement.current.playbackRate = speed;
            setPlayerState(Object.assign(Object.assign({}, playerState), { speed }));
        }
    };
    const toggleMute = () => {
        setPlayerState(Object.assign(Object.assign({}, playerState), { isMuted: !playerState.isMuted }));
    };
    const currentTimeStamp = () => {
        const sec = parseInt(mediaElement.current.currentTime, 10);
        let hours = Math.floor(sec / 3600);
        let minutes = Math.floor((sec - hours * 3600) / 60);
        let seconds = sec - hours * 3600 - minutes * 60;
        if (hours < 10)
            hours = 0 + hours;
        if (minutes < 10)
            minutes = 0 + minutes;
        if (seconds < 10)
            seconds = 0 + seconds;
        return {
            formattedTime: `${hours}: ${minutes}:${seconds}`,
            sec,
        };
    };
    const handleUpdateTimeStamp = (e) => {
        const time = e.target.value;
        const [hours, minutes, seconds] = time.split(':');
        // const manualChange = +hours * 60 * 60 + +minutes * 60 + +seconds
        const manualChange = Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
        mediaElement.current.currentTime = manualChange;
        setPlayerState(Object.assign(Object.assign({}, playerState), { progress: manualChange }));
    };
    (0, react_1.useEffect)(() => {
        if (mediaElement.current !== null) {
            playerState.isMuted
                ? (mediaElement.current.muted = true)
                : (mediaElement.current.muted = false);
        }
    }, [playerState.isMuted, mediaElement]);
    return {
        playerState,
        togglePlay,
        handleOnTimeUpdate,
        handleVideoProgress,
        handleVideoSpeed,
        toggleMute,
        currentTimeStamp,
        handleUpdateTimeStamp,
    };
};
exports.usePandoMediaEditor = usePandoMediaEditor;
