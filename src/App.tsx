import "./App.css";
import * as React from "react";
import { PanoramaScene } from "./3d/scene";
import { useDrag } from './hooks/use-drag'

function App() {
  const appRef = React.useRef<HTMLDivElement>(null);
  const psRef = React.useRef<PanoramaScene>();

  const [onDrageStart, [x, y]] = useDrag()

  React.useEffect(() => {
    if (appRef.current) {
      psRef.current = new PanoramaScene(appRef.current);
    }
    
    return () => {
      psRef.current?.teardown();
    };
  }, []);

  React.useEffect(() => {
    console.log([x, y])

    psRef.current?.move(x / 1000, y / 1000)
  }, [x, y])

  return <div 
    className="App" 
    ref={appRef} 
    onPointerDown={onDrageStart}
  ></div>;
}

export default App;
