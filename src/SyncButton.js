import { useState, useEffect } from "react";
import { Icon, Button } from "semantic-ui-react";

function SyncButton() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const endpoint = "/sync";
    if (isLoading) {
      fetch(endpoint)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data["success"]) {
            alert("Successfully synced!");
          } else {
            alert("Failed to sync.");
          }
          setLoading(false);
        });
    }
  }, [isLoading]);

  function handleClick() {
    setLoading(true);
  }

  return (
    <Button
      color="teal"
      disabled={isLoading}
      onClick={!isLoading ? handleClick : null}
    >
      {isLoading ? <Icon loading name="sync" /> : <Icon name="sync" />}
      {isLoading ? "Syncing…" : "Sync with Hypothes.is"}
    </Button>
  );
}

export default SyncButton;
