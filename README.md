#react native todos app

Separate creiteria Work and Travel todo

AsyncStorage 
setItem("@id" , {});  Prerequisites : Object has to be reformed in string with JSON.stringify({}); 
getItem("@id");

toDos State 
type : {}

const [toDos, setToDos] = useState<IToDos>({});

 1. add new ToDo  
  
  const newToDos = {...toDos, [key_name] : {text: "work To Do", isWorking : true}} 
  setToDos(newToDos);
 
 2. delete ToDo existing 
  
  const newToDos = {...toDos}
  delete newToDos[key_name] ; 
  setToDos(newToDos);
  
  3. modify ToDo existing 
   
   const modToDos = {...toDos, [key_name] :{text: "new modified work", isWorking : true} }; 
   setToDos(modToDos);
  
  
