// Alternative Design Option 2: Circular Icon Design
// Replace the sport selection grid with this for a more minimalist approach

<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
  {getAllSports().map(([sportKey, sportConfig]) => {
    const IconComponent =
      SPORT_ICONS[sportConfig.icon as keyof typeof SPORT_ICONS];
    const colors = sportConfig.color;

    return (
      <button
        key={sportKey}
        onClick={() => handleSportSelection(sportKey)}
        className="group flex flex-col items-center space-y-4 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
      >
        {/* Large Circular Icon */}
        <div
          className={`w-20 h-20 rounded-full bg-${colors.iconBg} group-hover:bg-${colors.iconColor} group-hover:shadow-xl group-hover:shadow-${colors.background} transition-all duration-300 flex items-center justify-center group-hover:scale-110`}
        >
          <IconComponent
            className={`w-10 h-10 text-${colors.iconColor} group-hover:text-white transition-colors duration-300`}
          />
        </div>

        {/* Sport Name */}
        <div className="text-center">
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-gray-800">
            {sportConfig.displayName}
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-24">
            {sportConfig.description}
          </p>
        </div>

        {/* Quick Stats on Hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
          <div className="text-xs text-gray-400 space-y-1">
            {sportConfig.highlights.slice(0, 2).map((highlight, index) => (
              <p key={index}>{highlight}</p>
            ))}
          </div>
        </div>
      </button>
    );
  })}
</div>;
