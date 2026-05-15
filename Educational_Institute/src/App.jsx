//Necessary Imports for the page. This is the main page that manages overall system.
import { Route , Routes, BrowserRouter} from "react-router-dom";
import PublicLayout from './layouts/PublicLayout'
import PrivateLaout from './layouts/PrivateLayout'


import Home from './views/Home'
import InstitutionList from "./views/institution/InstitutionList";
import Comparison from "./views/comparison/Comparison";
import ComparisonCollege from "./views/comparison/ComparisonCollege";
import ComparisonSchool from "./views/comparison/ComparisonSchool"
import ComparisonPage from "./views/comparison/ComparisonPage";
import EachComparison from "./views/comparison/EachComparison";
import InstitutionPage from "./views/institution/InstitutionPage"
import CollegeList from "./views/institution/CollegeList";
import CollegePage from './views/institution/CollegePage';
import ConsultancyPost from "./views/admin/ConsultancyPost";
import SchoolPage from "./views/institution/SchoolPage";
import SchoolList from "./views/institution/SchoolList";
import Login from './views/auth/Login';
import CollegePost from "./views/admin/CollegePost";
import AdminInstitution from "./views/admin/Institution";
import SchoolPost from "./views/admin/SchoolPost";
import AuthenticationEnable from './components/auth/AuthenticationEnable';
import Post from "./views/discussion/Post";
import Admin from "./views/admin/Admin";
import EditConsultancy from "./views/admin/EditConsultancy";
import EditCollege from "./views/admin/EditCollege";
import EditSchool from "./views/admin/EditSchool";
import Register from "./views/auth/Register"
import User from "./views/admin/users/User";
import UserPost from "./views/admin/users/UserPost";
import RoleBasedAuth from './components/auth/RoleBasedAuth';
import LoginEnable from './components/auth/LoginEnable';
import UserPosts from "./views/discussion/UserPosts";

//main function for the page defined to be exported.
export default function App(){

  //this is the return statement that has bunch of routes defined and acts as the routing page for the app.
  return (
    <Routes>
      <Route path="/" element= {<PublicLayout/>}>
        <Route index element= { <Home/>}/>

        <Route element={<LoginEnable />}>
          <Route path="/auth/login" element= {<Login />}/>
          <Route path="/auth/register" element={<Register/>} />
        </Route>
        <Route path="/school" element={<SchoolList />} />
        <Route path="/college" element= { <CollegeList/>} />
        <Route path="/institution" element= { <InstitutionList/>} />

        <Route path="/school/:school" element={<SchoolPage/>} />
        <Route path="/college/:college" element= {<CollegePage/>}/>
        <Route path="/institution/:institution" element= {<InstitutionPage/>}/>

        <Route path="/comparison" element= { <Comparison/> } />
        <Route path="/comparison/school" element={<ComparisonSchool/>} />
        <Route path="/comparison/college" element= { <ComparisonCollege/> } />

        <Route element={<AuthenticationEnable/>}>

          <Route path="/discussion" element={<Post/>} />
          <Route path="/discussion/user/post" element={<UserPosts/>} />

          <Route element={<RoleBasedAuth/>}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/user" element={<User/>} />
            <Route path="/admin/new/school" element={<SchoolPost />} />
            <Route path="/admin/new/college" element={<CollegePost />} />
            <Route path="/admin/institution" element={<AdminInstitution />} />
            <Route path="/admin/new/consultancy" element={<ConsultancyPost/>} />
            <Route path="/admin/edit/user/:institution" element={<UserPost />} />
            <Route path="/admin/edit/school/:institution" element={<EditSchool/>} />
            <Route path="/admin/edit/college/:institution" element={<EditCollege/>} />
            <Route path="/admin/edit/institution/:institution" element={<EditConsultancy/>} />
            <Route path="/admin/edit/consultancy/:institution" element={<EditConsultancy/>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
