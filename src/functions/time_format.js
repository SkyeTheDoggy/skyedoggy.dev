export function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    const options = { hour: '2-digit', minute: '2-digit' };

    if (diffDays === 0) {
        return `Today at ${date.toLocaleTimeString([], options)}`;
    } else if (diffDays === 1) {
        return `Yesterday at ${date.toLocaleTimeString([], options)}`;
    } else {
        return date.toLocaleString('en-US', { ...options, month: '2-digit', day: '2-digit', year: 'numeric' });
    }
}


export function formatTimestamp(date, format = "f") {
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / 60000);

    const options = {
        "t": { hour: '2-digit', minute: '2-digit', hour12: true }, // Short time
        "T": { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }, // Long time
        "d": { month: '2-digit', day: '2-digit', year: '2-digit' }, // Short date
        "D": { month: 'long', day: '2-digit', year: 'numeric' }, // Long date
        "f": { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }, // Short date & time
        "F": { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }, // Long date & time
    };

    function formatRelativeTime(minutes) {
        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)} hour${Math.floor(minutes / 60) > 1 ? 's' : ''} ago`;
        return `${Math.floor(minutes / 1440)} day${Math.floor(minutes / 1440) > 1 ? 's' : ''} ago`;
    }

    if (format === "R") {
        return formatRelativeTime(diffMinutes);
    }

    const formatter = new Intl.DateTimeFormat('en-US', options[format]);
    return formatter.format(date);
}