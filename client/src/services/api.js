import axios from 'axios';

const apiRegister = async(data)=>{
   try {
    const response = await axios.post("http://localhost:8000/auth/register", data);
    alert("registered successfully")
    console.log(response.data);
    
  } catch (error) {
    if (error.response && error.response.status === 400) {
    alert(error.response.data.message);
  } else {
    alert("Something went wrong. Please try again.");
  }
  }
};

const apiLogin = async(data)=>{
   try {
    const response = await axios.post("http://localhost:8000/auth/login", data);
    alert("login successfully")
    console.log(response.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
    alert(error.response.data.message);
  } else {
    alert("Something went wrong. Please try again.");
  }
  }
};


const apiCompiler = async({language,code,input})=>{
    try {
      const response = await axios.post("http://localhost:8001/run",{language,code,input});
      // console.log(response);
      return response.data;
    } catch (error) {
      console.log("error while connecting to compiler",error);
    }
}
export {apiRegister,apiLogin,apiCompiler};