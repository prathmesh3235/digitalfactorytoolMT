import React, { useState } from 'react';
import { ArrowUpRight, Database, GitBranch } from 'lucide-react';

const InterfaceMatrix = () => {
  const [selectedPhase, setSelectedPhase] = useState(4);
  const [hoveredConnection, setHoveredConnection] = useState(null);

  const phases = [
    { id: 1, name: "Setting of objectives", shortDesc: "Strategic planning and goal definition" },
    { id: 2, name: "Establishment of product basis", shortDesc: "Product requirements and specifications" },
    { id: 3, name: "Concept planning", shortDesc: "Layout and process conceptualization" },
    { id: 4, name: "Detailed planning", shortDesc: "Technical specifications and implementation" },
    { id: 5, name: "Preparation for realization", shortDesc: "Implementation readiness" },
    { id: 6, name: "Monitoring of realization", shortDesc: "Execution oversight" },
    { id: 7, name: "Ramp-up support", shortDesc: "Production stabilization" }
  ];

  const connectionTypes = {
    direct: {
      color: '#10B981',
      label: 'Direct Influence'
    },
    indirect: {
      color: '#3B82F6',
      label: 'Indirect Influence'
    },
    feedback: {
      color: '#8B5CF6',
      label: 'Feedback Loop'
    }
  };

  const Arrow = ({ startPhase, endPhase, type }) => {
    const startX = (startPhase - 1) * 160 + 80;
    const endX = (endPhase - 1) * 160 + 80;
    const isBackward = endPhase < startPhase;
    
    // Calculate path based on arrow type and direction
    let path;
    if (type === 'feedback') {
      // Higher arc for feedback loops
      path = `
        M ${startX} 0
        Q ${(startX + endX) / 2} -60,
          ${endX} 0
      `;
    } else if (type === 'direct') {
      // Gentle curve for direct connections
      path = `
        M ${startX} ${isBackward ? -20 : 20}
        Q ${(startX + endX) / 2} ${isBackward ? -40 : 40},
          ${endX} ${isBackward ? -20 : 20}
      `;
    } else {
      // Wider curve for indirect connections
      path = `
        M ${startX} ${isBackward ? -10 : 10}
        Q ${(startX + endX) / 2} ${isBackward ? -80 : 80},
          ${endX} ${isBackward ? -10 : 10}
      `;
    }

    return (
      <g 
        className="transition-all duration-200"
        onMouseEnter={() => setHoveredConnection(`${startPhase}-${endPhase}-${type}`)}
        onMouseLeave={() => setHoveredConnection(null)}
      >
        <path
          d={path}
          stroke={connectionTypes[type].color}
          strokeWidth={hoveredConnection === `${startPhase}-${endPhase}-${type}` ? 2.5 : 2}
          fill="none"
          className="transition-all duration-200"
          markerEnd={`url(#${type}-arrow)`}
        />
      </g>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Factory Planning Interface Matrix</h2>
        <p className="text-gray-600">Phase {selectedPhase}: {phases[selectedPhase - 1].name}</p>
      </div>

      <div className="flex gap-6 mb-8">
        {Object.entries(connectionTypes).map(([type, { color, label }]) => (
          <div key={type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>

      <div className="relative h-[300px] mb-12">
        <svg className="w-full h-full" style={{ overflow: 'visible' }}>
          <defs>
            {Object.entries(connectionTypes).map(([type, { color }]) => (
              <marker
                key={type}
                id={`${type}-arrow`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
              </marker>
            ))}
          </defs>

          {/* Example connections for Phase 4 */}
          <Arrow startPhase={4} endPhase={3} type="feedback" />
          <Arrow startPhase={4} endPhase={5} type="direct" />
          <Arrow startPhase={4} endPhase={6} type="indirect" />
          <Arrow startPhase={4} endPhase={7} type="indirect" />
        </svg>

        <div className="absolute top-1/2 w-full flex justify-between transform -translate-y-1/2">
          {phases.map(phase => (
            <div
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`
                w-32 p-4 rounded-xl cursor-pointer transition-all duration-300
                ${selectedPhase === phase.id 
                  ? 'bg-emerald-500 text-white shadow-lg scale-105'
                  : 'bg-gray-50 hover:bg-emerald-50'
                }
              `}
            >
              <div className="text-center">
                <div className="font-semibold">Phase {phase.id}</div>
                <div className="text-sm mt-1">{phase.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <InfoPanel title="Outputs" icon={ArrowUpRight}>
          <div className="space-y-3">
            <OutputItem title="Product Requirements" desc="Key deliverable for next phase" />
            <OutputItem title="Design Specifications" desc="Key deliverable for next phase" />
            <OutputItem title="Resource Plans" desc="Key deliverable for next phase" />
          </div>
        </InfoPanel>

        <InfoPanel title="Outcomes" icon={Database}>
          <div className="space-y-3">
            <OutcomeItem title="Technical Documentation" />
            <OutcomeItem title="Process Maps" />
            <OutcomeItem title="Quality Metrics" />
          </div>
        </InfoPanel>

        <InfoPanel title="Influences" icon={GitBranch}>
          <div className="space-y-3">
            <InfluenceItem phase={5} type="Direct" />
            <InfluenceItem phase={6} type="Indirect" />
            <InfluenceItem phase={7} type="Indirect" />
          </div>
        </InfoPanel>
      </div>
    </div>
  );
};

const InfoPanel = ({ title, icon: Icon, children }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Icon className="text-emerald-600" />
      {title}
    </h3>
    {children}
  </div>
);

const OutputItem = ({ title, desc }) => (
  <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700">
    <div className="font-medium">{title}</div>
    <div className="text-sm mt-1">{desc}</div>
  </div>
);

const OutcomeItem = ({ title }) => (
  <div className="p-3 bg-white rounded-lg border border-gray-100">
    <div className="flex items-center gap-2">
      <Database className="w-4 h-4 text-emerald-600" />
      <span className="font-medium">{title}</span>
    </div>
  </div>
);

const InfluenceItem = ({ phase, type }) => (
  <div className="p-3 bg-white rounded-lg border border-gray-100">
    <div className="flex justify-between items-center">
      <span className="font-medium">Phase {phase}</span>
      <span className={`px-2 py-1 rounded text-sm ${
        type === 'Direct' 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'bg-blue-100 text-blue-700'
      }`}>
        {type}
      </span>
    </div>
  </div>
);

export default InterfaceMatrix;