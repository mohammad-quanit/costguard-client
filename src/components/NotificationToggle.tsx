
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const NotificationToggle = () => {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [emailAddress, setEmailAddress] = useState("user@example.com");
  const [slackWebhook, setSlackWebhook] = useState("");

  const handleSave = () => {
    console.log("Saving notification settings:", {
      emailEnabled,
      slackEnabled,
      emailAddress,
      slackWebhook
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Email Notifications</Label>
          <p className="text-sm text-slate-600">
            Receive alerts via email
          </p>
        </div>
        <Switch
          checked={emailEnabled}
          onCheckedChange={setEmailEnabled}
        />
      </div>

      {emailEnabled && (
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Slack Notifications</Label>
          <p className="text-sm text-slate-600">
            Send alerts to Slack channel
          </p>
        </div>
        <Switch
          checked={slackEnabled}
          onCheckedChange={setSlackEnabled}
        />
      </div>

      {slackEnabled && (
        <div className="space-y-2">
          <Label htmlFor="slack">Slack Webhook URL</Label>
          <Input
            id="slack"
            type="url"
            value={slackWebhook}
            onChange={(e) => setSlackWebhook(e.target.value)}
            placeholder="https://hooks.slack.com/..."
          />
        </div>
      )}

      <Button onClick={handleSave} className="w-full">
        Save Notification Settings
      </Button>
    </div>
  );
};
