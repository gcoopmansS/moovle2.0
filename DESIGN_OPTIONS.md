/\*\*

- ALTERNATIVE DESIGN OPTIONS FOR SPORT SELECTION STEP
-
- Current Implementation: Compact Grid Cards with Hover Overlays
- - Modern card design with rounded corners
- - Hover animations (lift, scale, shadow)
- - Overlay with detailed information on hover
- - Responsive grid (2 cols mobile, 3-4 cols desktop)
    \*/

// OPTION 2: CIRCULAR ICON DESIGN
// Replace the current grid with this for a more minimalist approach:
/\*

<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
  {getAllSports().map(([sportKey, sportConfig]) => {
    const IconComponent = SPORT_ICONS[sportConfig.icon as keyof typeof SPORT_ICONS];
    const colors = sportConfig.color;
    
    return (
      <button className="group flex flex-col items-center space-y-4 p-6">
        <div className={`w-20 h-20 rounded-full bg-${colors.iconBg} group-hover:bg-${colors.iconColor} transition-all duration-300 flex items-center justify-center group-hover:scale-110`}>
          <IconComponent className={`w-10 h-10 text-${colors.iconColor} group-hover:text-white`} />
        </div>
        <h3 className="font-bold text-gray-900">{sportConfig.displayName}</h3>
      </button>
    );
  })}
</div>
*/

// OPTION 3: HORIZONTAL LIST WITH DETAILS
// More traditional layout with side-by-side information:
/\*

<div className="space-y-4">
  {getAllSports().map(([sportKey, sportConfig]) => (
    <button className="w-full flex items-center p-6 border rounded-lg hover:shadow-lg">
      <div className="flex-shrink-0 mr-6">
        <IconComponent className="w-12 h-12" />
      </div>
      <div className="flex-grow text-left">
        <h3 className="text-xl font-semibold">{sportConfig.displayName}</h3>
        <p className="text-gray-600">{sportConfig.description}</p>
        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          {sportConfig.highlights.map(highlight => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
      </div>
    </button>
  ))}
</div>
*/

// OPTION 4: TILE MOSAIC DESIGN
// Pinterest-style tiles with different sizes:
/\*

<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {getAllSports().map(([sportKey, sportConfig], index) => (
    <button className={`${index === 0 ? 'md:col-span-2' : ''} relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-${colors.iconBg} to-${colors.background} p-6 group`}>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
      <div className="relative z-10 h-full flex flex-col justify-between">
        <IconComponent className="w-12 h-12" />
        <div>
          <h3 className="font-bold text-lg">{sportConfig.displayName}</h3>
          <p className="text-sm opacity-75">{sportConfig.description}</p>
        </div>
      </div>
    </button>
  ))}
</div>
*/

export {};
