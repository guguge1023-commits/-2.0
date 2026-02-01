
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import MorphedTree from './components/MorphedTree';
import { COLORS } from './constants';
import { TreeMorphState } from './types';
import { generateHolidayGreeting } from './services/geminiService';

const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#011611]">
    <h1 className="text-4xl font-cinzel text-[#D4AF37] animate-pulse tracking-widest mb-4">ARIX SIGNATURE</h1>
    <div className="w-48 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
    <p className="mt-4 text-[#D4AF37]/60 font-light tracking-[0.2em] uppercase text-xs">Curating Elegance...</p>
  </div>
);

const App: React.FC = () => {
  const [greeting, setGreeting] = useState<string>("Bespoke Holiday Splendor Awaits.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [userName, setUserName] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [treeState, setTreeState] = useState<TreeMorphState>('SCATTERED');

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await generateHolidayGreeting(userName || "Distinguished Guest");
    setGreeting(result);
    setIsGenerating(false);
    setShowInput(false);
    // Assemble the tree when greeting is generated
    setTreeState('TREE_SHAPE');
  };

  const toggleState = () => {
    setTreeState(prev => prev === 'SCATTERED' ? 'TREE_SHAPE' : 'SCATTERED');
  };

  return (
    <div className="relative w-full h-screen bg-[#011611] overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-8 md:p-16">
        {/* Header */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div>
            <h1 className="text-3xl md:text-5xl font-cinzel text-[#D4AF37] tracking-widest drop-shadow-2xl">
              ARIX
            </h1>
            <p className="text-[#D4AF37]/70 text-sm md:text-base tracking-[0.3em] font-light">
              SIGNATURE INTERACTIVE
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[#D4AF37] font-cinzel text-xl">EST. 2024</p>
            <p className="text-[#D4AF37]/50 text-xs tracking-widest uppercase">{treeState === 'SCATTERED' ? 'Matter Dissolved' : 'Form Manifested'}</p>
          </div>
        </header>

        {/* AI Greeting Component & Controls */}
        <div className="max-w-xl self-start pointer-events-auto mt-12 space-y-4">
          <div className="bg-black/20 backdrop-blur-md border border-[#D4AF37]/30 p-6 rounded-sm shadow-2xl transition-all duration-700">
            {showInput ? (
              <div className="space-y-4">
                <p className="text-[#D4AF37] font-light italic text-lg leading-relaxed">
                  "Allow us to craft a signature holiday message for your presence."
                </p>
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="ENTER YOUR NAME"
                    className="bg-transparent border-b border-[#D4AF37]/50 text-[#D4AF37] focus:outline-none py-2 tracking-widest uppercase text-sm w-full"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-6 py-2 bg-[#D4AF37] text-[#011611] font-bold tracking-widest uppercase text-xs hover:bg-[#FFD700] transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? "CRAFTING..." : "REVEAL"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-1000">
                <p className="text-[#D4AF37] font-light italic text-xl leading-relaxed">
                  "{greeting}"
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowInput(true)}
                    className="text-[#D4AF37]/60 text-[10px] tracking-widest uppercase border-b border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all"
                  >
                    Change Signature
                  </button>
                  <div className="h-px w-8 bg-[#D4AF37]/20" />
                  <button
                    onClick={toggleState}
                    className="text-[#D4AF37] text-[10px] tracking-[0.2em] uppercase font-bold hover:tracking-[0.3em] transition-all"
                  >
                    {treeState === 'SCATTERED' ? 'Assemble Tree' : 'Dissolve Tree'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-end pointer-events-auto">
          <div className="text-xs text-[#D4AF37]/40 tracking-widest space-y-2">
            <p className="uppercase">{treeState === 'SCATTERED' ? 'Awaiting Manifestation' : 'Majesty In Form'}</p>
            <p>DRAG TO ROTATE THE MAJESTY</p>
          </div>
          <div className="flex gap-4">
             <button 
              onClick={toggleState}
              className="px-6 py-3 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] tracking-[0.25em] uppercase hover:bg-[#D4AF37] hover:text-[#011611] transition-all"
            >
              {treeState === 'SCATTERED' ? 'Assemble' : 'Dissolve'}
            </button>
          </div>
        </footer>
      </div>

      {/* 3D Scene */}
      <Suspense fallback={<LoadingScreen />}>
        <Canvas shadows gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 1.5, 9]} fov={45} />
          
          <fog attach="fog" args={['#011611', 5, 25]} />
          
          <ambientLight intensity={0.4} />
          <spotLight 
            position={[10, 15, 10]} 
            angle={0.3} 
            penumbra={1} 
            intensity={2.5} 
            castShadow 
            color={COLORS.gold}
          />
          <pointLight position={[-10, 5, -5]} intensity={1.5} color={COLORS.emerald} />

          <group position={[0, -1.8, 0]}>
            <Float speed={treeState === 'SCATTERED' ? 1 : 0.5} rotationIntensity={0.2} floatIntensity={0.3}>
              <MorphedTree state={treeState} />
            </Float>
            {treeState === 'TREE_SHAPE' && (
              <ContactShadows opacity={0.5} scale={15} blur={3} far={4} resolution={256} color="#000000" />
            )}
          </group>

          <OrbitControls 
            enablePan={false} 
            minDistance={5} 
            maxDistance={15} 
            autoRotate={treeState === 'TREE_SHAPE'} 
            autoRotateSpeed={0.5}
            makeDefault
          />
          
          <Environment preset="night" />

          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.6} 
              mipmapBlur 
              intensity={1.5} 
              radius={0.5} 
            />
            <ChromaticAberration offset={[0.0008, 0.0008]} />
            <Vignette eskil={false} offset={0.1} darkness={1.2} />
          </EffectComposer>
        </Canvas>
      </Suspense>

      {/* Luxury Golden Border */}
      <div className="fixed inset-0 pointer-events-none border-[12px] border-double border-[#D4AF37]/20 z-20"></div>
    </div>
  );
};

export default App;
