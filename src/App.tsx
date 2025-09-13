import React, { useState, useEffect } from 'react';
import { Leaf, Award, MapPin, TrendingUp, Users, Battery, Zap, Car, Menu, X } from 'lucide-react';
import LoginPage from './components/LoginPage';

interface CarbonEntry {
  id: string;
  date: string;
  transport: number;
  electricity: number;
  total: number;
}

interface EcoAction {
  id: string;
  action: string;
  points: number;
  icon: string;
  completed: boolean;
}

interface EWasteLocation {
  id: string;
  name: string;
  address: string;
  items: string[];
  status: 'pending' | 'collected';
  lat: number;
  lng: number;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalPoints, setTotalPoints] = useState(1250);
  const [carbonEntries, setCarbonEntries] = useState<CarbonEntry[]>([
    { id: '1', date: '2025-01-17', transport: 12, electricity: 8, total: 20 },
    { id: '2', date: '2025-01-16', transport: 15, electricity: 6, total: 21 },
    { id: '3', date: '2025-01-15', transport: 8, electricity: 10, total: 18 }
  ]);

  const [ecoActions, setEcoActions] = useState<EcoAction[]>([
    { id: '1', action: 'Turn off lights when leaving', points: 10, icon: '💡', completed: false },
    { id: '2', action: 'Use stairs instead of elevator', points: 15, icon: '🪜', completed: false },
    { id: '3', action: 'Bring reusable water bottle', points: 20, icon: '🍃', completed: true },
    { id: '4', action: 'Cycle to campus', points: 25, icon: '🚲', completed: false },
    { id: '5', action: 'Plant a tree', points: 50, icon: '🌱', completed: false }
  ]);

  const [ewasteLocations, setEwasteLocations] = useState<EWasteLocation[]>([
    {
      id: '1',
      name: 'Main Library',
      address: '123 Campus Drive',
      items: ['Old phones', 'Batteries', 'Chargers'],
      status: 'pending',
      lat: 40.7128,
      lng: -74.0060
    },
    {
      id: '2',
      name: 'Student Center',
      address: '456 University Ave',
      items: ['Laptops', 'Tablets'],
      status: 'collected',
      lat: 40.7589,
      lng: -73.9851
    }
  ]);

  const [transportType, setTransportType] = useState('car');
  const [distance, setDistance] = useState('');
  const [electricityUsage, setElectricityUsage] = useState('');

  const carbonFactors = {
    car: 0.21,
    bus: 0.089,
    train: 0.041,
    bike: 0,
    walk: 0
  };

  const calculateCarbonFootprint = () => {
    const transportCarbon = parseFloat(distance || '0') * carbonFactors[transportType as keyof typeof carbonFactors];
    const electricityCarbon = parseFloat(electricityUsage || '0') * 0.5;
    const total = transportCarbon + electricityCarbon;

    const newEntry: CarbonEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      transport: Math.round(transportCarbon * 10) / 10,
      electricity: Math.round(electricityCarbon * 10) / 10,
      total: Math.round(total * 10) / 10
    };

    setCarbonEntries([newEntry, ...carbonEntries.slice(0, 6)]);
    setDistance('');
    setElectricityUsage('');
  };

  const completeAction = (actionId: string) => {
    setEcoActions(actions => actions.map(action => {
      if (action.id === actionId && !action.completed) {
        setTotalPoints(prev => prev + action.points);
        return { ...action, completed: true };
      }
      return action;
    }));
  };

  const weeklyAverage = carbonEntries.length > 0 
    ? Math.round((carbonEntries.reduce((sum, entry) => sum + entry.total, 0) / carbonEntries.length) * 10) / 10
    : 0;

  const achievements = [
    { name: 'Carbon Saver', description: 'Reduced weekly average by 20%', earned: weeklyAverage < 15, icon: '🌍' },
    { name: 'Green Warrior', description: 'Earned 1000+ EcoPoints', earned: totalPoints >= 1000, icon: '⚔️' },
    { name: 'E-Waste Hero', description: 'Reported 3+ e-waste locations', earned: ewasteLocations.length >= 2, icon: '♻️' }
  ];

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'carbon', name: 'Carbon Tracker', icon: Leaf },
    { id: 'ecopoints', name: 'EcoPoints', icon: Award },
    { id: 'ewaste', name: 'E-Waste Map', icon: MapPin }
  ];

  const TabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total EcoPoints</p>
                    <p className="text-3xl font-bold text-green-600">{totalPoints.toLocaleString()}</p>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Weekly Avg CO₂</p>
                    <p className="text-3xl font-bold text-blue-600">{weeklyAverage} kg</p>
                  </div>
                  <Leaf className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">E-Waste Spots</p>
                    <p className="text-3xl font-bold text-purple-600">{ewasteLocations.length}</p>
                  </div>
                  <Battery className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Achievements</p>
                    <p className="text-3xl font-bold text-orange-600">{achievements.filter(a => a.earned).length}/3</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Carbon Footprint Trend
                </h3>
                <div className="space-y-3">
                  {carbonEntries.slice(0, 5).map((entry, index) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(entry.total * 4, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{entry.total} kg CO₂</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-orange-600" />
                  Recent Achievements
                </h3>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        achievement.earned 
                          ? 'bg-green-50 border-green-200 shadow-sm' 
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h4 className={`font-medium ${achievement.earned ? 'text-green-800' : 'text-gray-600'}`}>
                            {achievement.name}
                          </h4>
                          <p className={`text-sm ${achievement.earned ? 'text-green-600' : 'text-gray-500'}`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned && (
                          <div className="ml-auto">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Earned
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'carbon':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Leaf className="h-6 w-6 mr-2 text-green-600" />
                Daily Carbon Footprint Calculator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Car className="h-4 w-4 inline mr-1" />
                      Transportation Method
                    </label>
                    <select 
                      value={transportType}
                      onChange={(e) => setTransportType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="car">Car</option>
                      <option value="bus">Bus</option>
                      <option value="train">Train</option>
                      <option value="bike">Bicycle</option>
                      <option value="walk">Walking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distance Traveled (km)</label>
                    <input
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter distance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Zap className="h-4 w-4 inline mr-1" />
                      Electricity Usage (kWh)
                    </label>
                    <input
                      type="number"
                      value={electricityUsage}
                      onChange={(e) => setElectricityUsage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Daily electricity usage"
                    />
                  </div>
                  <button
                    onClick={calculateCarbonFootprint}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Calculate Carbon Footprint
                  </button>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">Your Carbon Impact</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Weekly Average:</span>
                      <span className="font-bold text-lg text-green-600">{weeklyAverage} kg CO₂</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(weeklyAverage * 5, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      {weeklyAverage < 15 
                        ? "Great job! You're below the average student carbon footprint." 
                        : "Consider using more eco-friendly transportation to reduce your impact."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-semibold mb-4">Recent Entries</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Transport CO₂</th>
                      <th className="text-left py-3 px-4">Electricity CO₂</th>
                      <th className="text-left py-3 px-4">Total CO₂</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carbonEntries.map((entry) => (
                      <tr key={entry.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{new Date(entry.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{entry.transport} kg</td>
                        <td className="py-3 px-4">{entry.electricity} kg</td>
                        <td className="py-3 px-4 font-semibold">{entry.total} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'ecopoints':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">EcoPoints System</h2>
                  <p className="text-green-100">Earn points for sustainable actions and compete with friends!</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Your Points</p>
                  <p className="text-4xl font-bold">{totalPoints.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-orange-600" />
                  Available Actions
                </h3>
                <div className="space-y-3">
                  {ecoActions.map((action) => (
                    <div
                      key={action.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        action.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200 hover:border-green-300 cursor-pointer'
                      }`}
                      onClick={() => !action.completed && completeAction(action.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{action.icon}</span>
                          <div>
                            <h4 className={`font-medium ${action.completed ? 'text-green-800' : 'text-gray-800'}`}>
                              {action.action}
                            </h4>
                            <p className={`text-sm ${action.completed ? 'text-green-600' : 'text-gray-600'}`}>
                              +{action.points} points
                            </p>
                          </div>
                        </div>
                        {action.completed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : (
                          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors">
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Campus Leaderboard
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'Alex Chen', points: 2150, rank: 1 },
                    { name: 'You', points: totalPoints, rank: 2 },
                    { name: 'Sarah Kim', points: 1180, rank: 3 },
                    { name: 'Mike Johnson', points: 950, rank: 4 },
                    { name: 'Emma Davis', points: 720, rank: 5 }
                  ].sort((a, b) => b.points - a.points).map((user, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        user.name === 'You' 
                          ? 'bg-green-50 border-2 border-green-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <span className={`font-medium ${user.name === 'You' ? 'text-green-800' : 'text-gray-800'}`}>
                          {user.name}
                        </span>
                      </div>
                      <span className={`font-bold ${user.name === 'You' ? 'text-green-600' : 'text-gray-600'}`}>
                        {user.points.toLocaleString()} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'ewaste':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Battery className="h-6 w-6 mr-2 text-purple-600" />
                E-Waste Collection Map
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium mb-4">Collection Locations</h4>
                  <div className="space-y-4">
                    {ewasteLocations.map((location) => (
                      <div key={location.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{location.name}</h5>
                            <p className="text-sm text-gray-600">{location.address}</p>
                            <div className="mt-2">
                              <p className="text-sm text-gray-700">Items:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {location.items.map((item, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            location.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {location.status === 'pending' ? 'Pending Pickup' : 'Collected'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-purple-900 mb-2">Report New E-Waste Location</h5>
                    <p className="text-sm text-purple-700 mb-3">
                      Found e-waste that needs collection? Report it here to earn 30 EcoPoints!
                    </p>
                    <button 
                      onClick={() => {
                        const newLocation: EWasteLocation = {
                          id: Date.now().toString(),
                          name: 'New Location',
                          address: 'Location pending verification',
                          items: ['Electronics'],
                          status: 'pending',
                          lat: 40.7500,
                          lng: -73.9900
                        };
                        setEwasteLocations([...ewasteLocations, newLocation]);
                        setTotalPoints(prev => prev + 30);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      + Report Location
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <MapPin className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">Interactive Map</p>
                    <p className="text-sm mt-2">Campus e-waste collection points would be displayed here</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-yellow-200 text-yellow-800 p-2 rounded">📍 Pending: {ewasteLocations.filter(l => l.status === 'pending').length}</div>
                      <div className="bg-green-200 text-green-800 p-2 rounded">✅ Collected: {ewasteLocations.filter(l => l.status === 'collected').length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-semibold mb-4">E-Waste Impact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{ewasteLocations.filter(l => l.status === 'collected').length * 5} kg</div>
                  <div className="text-sm text-blue-700">E-waste collected</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{ewasteLocations.length * 15} kg</div>
                  <div className="text-sm text-green-700">CO₂ prevented</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{ewasteLocations.length}</div>
                  <div className="text-sm text-purple-700">Locations reported</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  EcoTrack
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabContent />
      </main>
    </div>
  );
}

export default App;