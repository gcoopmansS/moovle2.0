export default function CreatePage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Create Activity
        </h1>
        <p className="text-text-secondary text-lg">
          Organize a sport activity with your mates
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Form Card */}
        <div className="bg-surface rounded-2xl shadow-sm border border-text-secondary/10 p-6">
          <form className="space-y-6">
            {/* Activity Title */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Activity Title
              </label>
              <input
                type="text"
                placeholder="e.g., Morning Tennis Session"
                className="w-full px-4 py-3 rounded-xl border border-text-secondary/20 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
            </div>

            {/* Sport & Privacy Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Sport
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-text-secondary/20 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200">
                  <option value="">Select sport</option>
                  <option value="tennis">� Tennis</option>
                  <option value="padel">🏓 Padel</option>
                  <option value="running">🏃‍♂️ Running</option>
                  <option value="cycling">🚴‍♂️ Cycling</option>
                  <option value="walking">🚶‍♂️ Walking</option>
                  <option value="gym">💪 Gym</option>
                  <option value="other">⚽ Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Privacy
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-text-secondary/20 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200">
                  <option value="PUBLIC">🌍 Public</option>
                  <option value="MATES">👥 Mates Only</option>
                  <option value="INVITE_ONLY">📩 Invite Only</option>
                </select>
              </div>
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-text-secondary/20 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-3 rounded-xl border border-text-secondary/20 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., Central Park Tennis Courts"
                className="w-full px-4 py-3 rounded-xl border border-text-secondary/20 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
            </div>

            {/* Duration & Capacity Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  placeholder="90"
                  min="15"
                  max="480"
                  className="w-full px-4 py-3 rounded-xl border border-text-secondary/20 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  placeholder="4"
                  min="2"
                  max="50"
                  className="w-full px-4 py-3 rounded-xl border border-text-secondary/20 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Auto Accept */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoAccept"
                className="w-4 h-4 text-primary bg-surface border-text-secondary/20 rounded focus:ring-primary/20 focus:ring-2"
              />
              <label htmlFor="autoAccept" className="text-sm text-text-primary">
                Automatically accept join requests
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-text-secondary/10">
              <button
                type="button"
                className="px-6 py-3 border border-text-secondary/20 text-text-secondary hover:bg-text-secondary/5 rounded-xl font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Create Activity
              </button>
            </div>
          </form>
        </div>

        {/* Form Preview/Tips */}
        <div className="mt-6 bg-primary/5 rounded-2xl border border-primary/10 p-4">
          <div className="flex items-start space-x-3">
            <div className="text-primary text-lg">💡</div>
            <div>
              <h4 className="font-medium text-text-primary mb-1">
                Tips for great activities
              </h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Choose a clear, descriptive title</li>
                <li>• Pick a convenient location for participants</li>
                <li>• Set realistic capacity based on sport type</li>
                <li>• Enable auto-accept for casual activities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
