import { useParams, useNavigate } from "react-router-dom";

export default function withRouter(Children){
  return(props)=>{
     const match = {params: useParams()};
     const navigate = useNavigate();
     return <Children {...props}  match={match} navigate={navigate}/>
 }
}