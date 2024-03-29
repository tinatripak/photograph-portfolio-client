import React, { useEffect, useState, useCallback } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useCookies } from "react-cookie";
import { Home, EditHome } from "./Home";
import { Bookings, CreateBooking, EditBooking } from "./Bookings";
import { Bio, EditBio } from "./Bio";
import {
  Photography,
  UpdatePhotography,
  CreatePhotography,
} from "./Photography";
import {
  TypesOfPhotography,
  CreateTypeOfPhotography,
  EditTypeOfPhotography,
} from "./TypesOfPhotography";
import { General } from "./General";
import { Admins, CreateAnAdmin, EditAdmin } from "./Admins";
import { Questions, AnswerQuestion } from "./Questions";
import { getAdminById } from "../../services/AdminService";
import jwtDecode from "jwt-decode";
import {
  adminDashboardLink,
  adminLink,
  adminsLink,
  answerLink,
  bioLink,
  bookingLink,
  bookingsLink,
  createLink,
  editLink,
  generalLink,
  homeLink,
  loginLink,
  photographyLink,
  questionLink,
  questionsLink,
  typeLink,
  typesLink,
} from "../../constants";
import classes from "./AdminPanel.module.scss";
import DropdownMenu from "../../components/DropdownMenu/DropdownMenu";
import { faL } from "@fortawesome/free-solid-svg-icons";

const textDecorationStyles = ({ isActive }) => {
  return {
    textDecoration: isActive ? "underline" : "",
  };
};

const AdminPanel = () => {
  const [cookies] = useCookies(["token"]);
  const [admin, setAdmin] = useState([]);
  const navigate = useNavigate();

  const decoded =
    cookies?.token &&
    cookies?.token !== "undefined" &&
    cookies?.token !== undefined
      ? jwtDecode(cookies.token)
      : null;
      
  const getAdmin = useCallback(() => {
    getAdminById(decoded?.id).then((data) => {
      setAdmin(data?.data);
    });
  }, [decoded]);

  useEffect(() => {
    if (decoded == null) {
      navigate("/login");
    } else{
      getAdmin();
    }
  }, [decoded]);

  return (
    <div className={classes.panel}>
      <div className={classes.menu}>
        <div>
          <Link to={`${adminDashboardLink}${generalLink}`}>
            <div className={classes.logo}>
              <img src="/logo-camera.png" alt="Logo" />
              <p>KSIGALLERY</p>
            </div>
          </Link>
          <div className={classes.navLinks}>
            <div className={classes.link}>
              <NavLink
                to={`${adminDashboardLink}${homeLink}`}
                style={textDecorationStyles}
              >
                Home
              </NavLink>
            </div>

            <div className={classes.link}>
              <NavLink
                to={`${adminDashboardLink}${bioLink}`}
                style={textDecorationStyles}
              >
                About photographer
              </NavLink>
            </div>

            <div className={classes.link}>
              <NavLink
                to={`${adminDashboardLink}${photographyLink}`}
                style={textDecorationStyles}
              >
                All photography
              </NavLink>
            </div>
            <div className={classes.link}>
              <NavLink
                to={`${adminDashboardLink}${typesLink}`}
                style={textDecorationStyles}
              >
                Types of photoshoots
              </NavLink>
            </div>
            <div className={classes.link}>
              <NavLink
                to={`${adminDashboardLink}${bookingsLink}`}
                style={textDecorationStyles}
              >
                Bookings
              </NavLink>
            </div>
            <div className={classes.link}>
              <NavLink
                to={`${adminDashboardLink}${adminsLink}`}
                style={textDecorationStyles}
              >
                Admins
              </NavLink>
            </div>
            <div className={classes.link}>
              <NavLink
                to={`${adminDashboardLink}${questionsLink}`}
                style={textDecorationStyles}
              >
                Questions
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.main}>
        <div className={classes.settings}>
          <div className={classes.user}>
            <img src={admin?.photo} alt="User" />
            <p>{admin?.username}</p>
            <div>
              <DropdownMenu />
            </div>
          </div>
        </div>

        <div className={classes.block}>
          <Routes>
            <Route path={`${generalLink}`} element={<General />} />

            <Route path={`${homeLink}`} element={<Home />} />
            <Route path={`${homeLink}${editLink}/:id`} element={<EditHome />} />

            <Route path={`${bioLink}`} element={<Bio />} />
            <Route path={`${bioLink}${editLink}/:id`} element={<EditBio />} />

            <Route path={`${photographyLink}`} element={<Photography />} />
            <Route
              path={`${photographyLink}${editLink}/:id`}
              element={<UpdatePhotography />}
            />
            <Route
              path={`${photographyLink}${createLink}`}
              element={<CreatePhotography />}
            />

            <Route path={`${typesLink}`} element={<TypesOfPhotography />} />
            <Route
              path={`${typeLink}${editLink}/:id`}
              element={<EditTypeOfPhotography />}
            />
            <Route
              path={`${typeLink}${createLink}`}
              element={<CreateTypeOfPhotography />}
            />

            <Route path={`${bookingsLink}`} element={<Bookings />} />
            <Route
              path={`${bookingLink}${editLink}/:id`}
              element={<EditBooking />}
            />
            <Route
              path={`${bookingLink}${createLink}`}
              element={<CreateBooking />}
            />

            <Route path={`${adminsLink}`} element={<Admins />} />

            <Route
              path={`${adminLink}${createLink}`}
              element={
                <ProtectedRoute adminRole={admin?.role}>
                  <CreateAnAdmin />
                </ProtectedRoute>
              }
            />

            <Route
              path={`${adminLink}${editLink}/:id`}
              element={
                <ProtectedRoute adminRole={admin?.role}>
                  <EditAdmin />
                </ProtectedRoute>
              }
            />

            <Route path={`${questionsLink}`} element={<Questions />} />
            <Route
              path={`${questionLink}${answerLink}/:id`}
              element={<AnswerQuestion />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

const ProtectedRoute = ({
  adminRole,
  redirectPath = `${adminDashboardLink}${adminsLink}`,
  children,
}) => {
  const [cookies] = useCookies([]);
  const decoded =
    cookies?.token &&
    cookies?.token !== "undefined" &&
    cookies?.token !== undefined
      ? jwtDecode(cookies.token)
      : null;
  const navigate = useNavigate();

  if (decoded === null) {
    navigate(loginLink);
  }

  if (!cookies.token || !decoded || adminRole !== "chief admin") {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
