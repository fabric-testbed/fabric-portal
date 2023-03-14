import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function withRouter(Children){
  return(props)=>{
     const match = {params: useParams()};
     const navigate = useNavigate();
     const location = useLocation();
     return <Children
        {...props}
        match={match}
        navigate={navigate}
        location={location}
      />
 }
}