(function(){
  const DATA_SRC = "js/data.js";
  const state = { loaded: false, promise: null };

  function hasSeedData(){
    try{
      return (Array.isArray(window.senalesHorizontal) && window.senalesHorizontal.length)
        || (Array.isArray(window.senalesVertical) && window.senalesVertical.length)
        || (Array.isArray(window.proyectosSeed) && window.proyectosSeed.length);
    }catch(e){
      return false;
    }
  }

  function shouldLoadDemoData(){
    return !window.UrbbisApi;
  }

  function markLoaded(){
    state.loaded = true;
    try{ window.URBBIS_DATA_READY = true; }catch(e){}
    try{
      const evt = typeof Event === "function" ? new Event("urbbis:data-loaded") : null;
      if(evt) window.dispatchEvent(evt);
    }catch(e){}
  }

  function loadScript(){
    return new Promise((resolve, reject)=>{
      const script = document.createElement("script");
      script.src = DATA_SRC;
      script.defer = true;
      script.onload = ()=> resolve(true);
      script.onerror = ()=> reject(new Error("No se pudo cargar data.js"));
      document.head.appendChild(script);
    });
  }

  function ensureDemoDataLoaded(options){
    if(!shouldLoadDemoData()) return Promise.resolve(false);
    if(state.loaded || hasSeedData()){
      state.loaded = true;
      return Promise.resolve(true);
    }
    if(state.promise) return state.promise;

    const immediate = !!(options && options.immediate);
    const startLoad = () => loadScript()
      .then(()=>{ markLoaded(); return true; })
      .catch((err)=>{
        console.warn("No se pudo cargar data demo.", err);
        state.promise = null;
        return false;
      });

    if(immediate){
      state.promise = startLoad();
      return state.promise;
    }

    state.promise = new Promise((resolve)=>{
      const schedule = window.requestIdleCallback
        ? (cb)=> window.requestIdleCallback(cb, { timeout: 2500 })
        : (cb)=> setTimeout(cb, 1200);
      schedule(()=>{ startLoad().then(resolve); });
    });

    return state.promise;
  }

  window.ensureDemoDataLoaded = ensureDemoDataLoaded;
  window.isDemoDataLoaded = function(){
    return state.loaded || hasSeedData();
  };
})();
