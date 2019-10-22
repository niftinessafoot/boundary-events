const roster = {};
const dims = {
  height: window.innerHeight,
  width: window.innerWidth
};

let isListening = false;

function getDimensions(){
  return dims;
}

function boundaryEvents(config){
  // Setting configurations.
  const defaults = {
    parent : window,
    eventName : 'cross',
    eventNameReturn : 'cross',
    initOnCall : true,
    bubbles : true,
    throttle : 66
  }

  // Merge configs into defaults and destructure the variable names
  const {
    parent,
    eventName,
    eventNameReturn,
    initOnCall,
    bubbles,
    throttle
  } = Object.assign(defaults,config);

  // Self-contain throttle mechanism so we don't spam the resize event listener.
  const resizeHandler = {
    timer : null,
    handleEvent : function(evt){
      if(!this.timer){
        const target = evt.target;

        this.timer = setTimeout(()=>{
          dims.height = target.innerHeight;
          dims.width = target.innerWidth;
          this.timer = null;

          report();
        }, throttle);
      }
    }
  }

  // Only register/remove resize events if we need to. Otherwise we would generate redundant events.
  function listenStart(){
    if(!isListening){
      window.addEventListener('resize', resizeHandler);
      isListening = true;
    }
    return true;
  }

  function listenEnd(){
    if(isListening){
      window.removeEventListener('resize', resizeHandler);
      isListening = false;
    }
    return true;
  }

  /**
   * Sets watchpoints for resize events.
   *
   * @param  {String}    id       User-defined key name. Passed back on event call.
   * @param  {Number}    boundary Defined in px. The boundary line to watch for.
   * @param  {Boolean}   isHeight Set to `true` if watching height resizing
   * @param  {...*}      data     Accepts any number of artibary parameters.
   *                              Payload passed back as an array in the event payload.
   *
   */
  function registerBoundary(id, boundary, isHeight, ...data){
    roster[id] = {
      boundary,
      isHeight,
      data: [...data],
      pastBoundary : isHeight ? dims.height > boundary : dims.width > boundary
    };
    return true;
  }

  /**
   * Removes boundary instance from the register.
   *
   * @param  {String} key User-defined key name. Identifier for which bourndary to remove.
   *
   */
  function removeBoundary(key){
    if(roster.hasOwnProperty(key)){
      return delete roster[key];
    }
    return true;
  }

  // References the current window size against the boundary and determines
  // if the boundary has been crossed.
  // It either hasn’t yet been crossed and the window is still too small or
  // we already crossed it earlier and the window is still large.
  function verify(cur){
    const {pastBoundary, boundary, isHeight} = cur;
    const dimension = !isHeight ? dims.width : dims.height;

    return (pastBoundary === (dimension < boundary));
  }

  // Iterate over the registry.
  // Updates appropriate registry entries to reflect we’ve crossed a boundary.
  // Dispatches the event with relevant payload data attached.
  function report(){
    Object.keys(roster).forEach(key => {
      const {pastBoundary, data, isHeight} = roster[key];

      if(verify(roster[key])){
        roster[key].pastBoundary = !pastBoundary;

        const localEventName = pastBoundary ? eventName : eventNameReturn;

        const payload = {
          key : key,
          width : dims.width,
          height : dims.height,
          pastBoundary : !pastBoundary,
          modified : !isHeight ? 'width' : 'height',
          data : data
        };

        try{

          if(!parent){
            throw 'Invalid event target. Check the parent property in user config.'
          }

          parent.dispatchEvent(new CustomEvent(localEventName,{detail:payload, bubbles:bubbles}));
        } catch(err){
          console.error(`${err}\n`,config)
        }
      }
    })
  }

  // Can init the listener manually via config.
  if(initOnCall){
    listenStart();
  }

  return {
    registerBoundary,
    removeBoundary,
    listenStart,
    listenEnd,
    isListening  : ()=>isListening
  };

}

export { getDimensions }
export default boundaryEvents;