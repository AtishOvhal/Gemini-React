import { createContext, useState } from "react";
import run from "../Config/Gemini";

// Create the context
const Context = createContext();

const ContextProvider = ({ children }) => {
   const [input, setInput] = useState('');
   const [recentPrompt, setRecentPrompt] = useState('');
   const [prevPrompt, setPrevPrompt] = useState([]);
   const [showResult, setShowResult] = useState(false);
   const [loading, setLoading] = useState(false);
   const [resultData, setResultData] = useState('');

   const delayPara = (index,nextWord)=> {
    setTimeout(() => {
        setResultData(prev=>prev+nextWord)
    }, 75*index);

   }

   const onSent = async () => {
       setResultData('');
       setLoading(true);
       setShowResult(true);
       setRecentPrompt(input);
       const result = await run(input);
       let responseArray = result.split("**")
       let newResponse;
       for( let i=0; i < responseArray.length; i++){

        if(i === 0 || i%2 !==1){
            newResponse += responseArray[i]
        }else{
            newResponse += '<b> ' +responseArray[i] + '</b>'
        }
       }

       let  newResponse2 = newResponse.split('*').join('</br>')
       let newResponseArray = newResponse2.split(' ')
       for( let i=0; i< newResponseArray.length; i++){

    const nextWord = newResponseArray[i]
    delayPara(i, nextWord, " ")
       } 
       setLoading(false);
       setInput('');
   };

   const contextValue = {
      prevPrompt,
      setPrevPrompt,
      onSent,
      setRecentPrompt,
      showResult,
      loading,
      resultData,
      input,
      setInput,
   };

   return (
      <Context.Provider value={contextValue}>
         {children}
      </Context.Provider>
   );
};

export { Context, ContextProvider }; // Named export for Context, but default export for ContextProvider
