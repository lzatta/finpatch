import React from "react";

type State = { hasError: boolean };
export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(p:any){ super(p); this.state={ hasError:false }; }
  static getDerivedStateFromError(){ return { hasError:true }; }
  componentDidCatch(err:any){ console.error("App error boundary:", err); }
  render(){
    if(this.state.hasError){
      return (
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-2">Algo deu errado</h1>
          <button className="px-3 py-2 bg-gray-200 rounded" onClick={() => location.reload()}>Recarregar</button>
        </div>
      );
    }
    return this.props.children;
  }
}
