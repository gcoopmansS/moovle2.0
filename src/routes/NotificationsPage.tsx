import { HiExclamationTriangle } from "react-icons/hi2";
import { TennisIcon } from "../components/sportIcons";

export default function NotificationsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Notifications
        </h1>
        <p className="text-text-secondary text-lg">
          Join requests and activity updates
        </p>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-w-2xl">
        {/* Unread Notification - Join Request */}
        <div className="bg-surface border border-text-secondary/10 p-4 hover:bg-surface/80 transition-colors duration-200 relative">
          {/* Unread indicator */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-primary"></div>

          <div className="flex items-start space-x-4 ml-6">
            <div className="bg-primary/10 p-2 flex-shrink-0">
              <TennisIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary font-medium">
                <span className="font-semibold">Mike Johnson</span> wants to
                join your tennis session
              </p>
              <p className="text-xs text-text-secondary mt-1">2 hours ago</p>
            </div>
            <div className="flex space-x-2 flex-shrink-0">
              <button className="bg-success text-white px-3 py-1.5 text-xs font-medium hover:bg-success/90 transition-colors duration-200">
                Accept
              </button>
              <button className="bg-text-secondary/10 text-text-secondary px-3 py-1.5 text-xs font-medium hover:bg-text-secondary/20 transition-colors duration-200">
                Decline
              </button>
            </div>
          </div>
        </div>

        {/* Read Notification - Acceptance */}
        <div className="bg-surface border border-text-secondary/10 p-4 hover:bg-surface/80 transition-colors duration-200 opacity-75">
          <div className="flex items-start space-x-4">
            <div className="bg-success/10 p-2 flex-shrink-0">
              <span className="text-success text-lg">�</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary">
                You've been accepted to{" "}
                <span className="font-medium">Weekend Padel Session</span>
              </p>
              <p className="text-xs text-text-secondary mt-1">5 hours ago</p>
            </div>
          </div>
        </div>

        {/* Read Notification - Schedule Change */}
        <div className="bg-surface border border-text-secondary/10 p-4 hover:bg-surface/80 transition-colors duration-200 opacity-75">
          <div className="flex items-start space-x-4">
            <div className="bg-warning/10 p-2 flex-shrink-0">
              <HiExclamationTriangle className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary">
                <span className="font-medium">Padel Match</span> has been moved
                to 7:00 PM
              </p>
              <p className="text-xs text-text-secondary mt-1">1 day ago</p>
            </div>
          </div>
        </div>

        {/* Read Notification - New Activity */}
        <div className="bg-surface border border-text-secondary/10 p-4 hover:bg-surface/80 transition-colors duration-200 opacity-75">
          <div className="flex items-start space-x-4">
            <div className="bg-secondary/10 p-2 flex-shrink-0">
              <TennisIcon className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary">
                <span className="font-medium">Alex Chen</span> created a new
                tennis activity near you
              </p>
              <p className="text-xs text-text-secondary mt-1">2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state when no notifications */}
      <div className="hidden text-center py-16 max-w-md mx-auto">
        <div className="text-5xl mb-4">🔕</div>
        <h3 className="text-xl font-medium text-text-primary mb-2">
          All caught up!
        </h3>
        <p className="text-text-secondary">You have no new notifications</p>
      </div>
    </div>
  );
}
