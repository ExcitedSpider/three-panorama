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
    psRef.current?.move(x, y)
  }, [x, y])

  return <div 
    className="App" 
    ref={appRef} 
    onPointerDown={onDrageStart}
    onClick={(e)=> console.log(psRef.current?.getPoint(e.clientX, e.clientY))}
  ></div>;
}

export default App;
