import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(duration);

const useSessionProgress = () => {
    const session = useSelector((state: RootState) => state.session);
    const [progress, setProgress] = useState(0);
    const [elapsedHours, setElapsedHours] = useState(0);
    const [elapsedMinutes, setElapsedMinutes] = useState(0);

    useEffect(() => {
        if (!session.sessionId || !session.plannedDuration) {
            setProgress(0);
            return;
        }

        const updateProgress = () => {
            if (!session.startTime) return;

            const startTime = dayjs.utc(session.startTime).valueOf();
            const now = dayjs.utc().valueOf();
            const elapsed = now - startTime;

            const hours = Math.floor(elapsed / (1000 * 60 * 60));
            const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
            setElapsedHours(hours);
            setElapsedMinutes(minutes);

            const newProgressPercent = Math.min(
                (elapsed / (session.plannedDuration * 3600000)) * 100,
                100
            );

            setProgress(newProgressPercent);
        };

        updateProgress();
        const interval = setInterval(updateProgress, 1000);

        return () => clearInterval(interval);
    }, [session.sessionId, session.startTime, session.plannedDuration]);

    return { progress, elapsedHours, elapsedMinutes };
};

export default useSessionProgress;
