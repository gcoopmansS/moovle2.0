import { CalendarIcon, TrophyIcon } from "../components/icons";

export default function AgendaPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">My Agenda</h1>
        <p className="text-text-secondary text-lg">
          Activities you've joined or created
        </p>
      </div>

      {/* Section Headers */}
      <div className="space-y-8">
        {/* Upcoming Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">
              Upcoming
            </h2>
            <span className="text-sm text-text-secondary bg-primary/10 px-3 py-1">
              0 activities
            </span>
          </div>

          <div className="bg-surface border border-text-secondary/10 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <CalendarIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Your schedule is clear
            </h3>
            <p className="text-text-secondary mb-4">
              Join some activities from the feed to see them here!
            </p>
            <button className="bg-primary text-white px-4 py-2 font-medium hover:bg-primary/90 transition-colors duration-200">
              Browse Activities
            </button>
          </div>
        </section>

        {/* Past Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Past</h2>
            <span className="text-sm text-text-secondary bg-text-secondary/10 px-3 py-1">
              0 activities
            </span>
          </div>

          <div className="bg-surface border border-text-secondary/10 p-8 text-center">
            <div className="mb-4 flex justify-center opacity-50">
              <TrophyIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No activity history yet
            </h3>
            <p className="text-text-secondary">
              Your completed activities will appear here
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
