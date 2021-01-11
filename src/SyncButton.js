import {useState, useEffect} from "react";
import Button from 'react-bootstrap/Button';

function SyncButton() {
    const [isLoading, setLoading] = useState(false);
    const [text, setText] = useState("Sync With Hypothes.is");

    function sync() {
        const endpoint = "/sync";
        if (isLoading) {
            fetch(endpoint)
                .then((response) => {
                    return response.json();
                }).then((data) => {
                    if (data["success"]) {
                        setText("Successfully synced.");
                    }
                });
        }
    }

    useEffect(() => {
        if (isLoading) {
            sync();
            setLoading(false);
        }
    }, [isLoading]);
    
    
    const handleClick = () => setLoading(true);

    return (
            <Button
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}>
            {isLoading ? 'Syncing…' : text }
        </Button>
    );
}

export default SyncButton;
