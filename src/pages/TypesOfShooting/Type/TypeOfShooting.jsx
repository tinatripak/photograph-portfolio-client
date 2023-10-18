import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import classes from "./TypeOfShooting.module.scss";
import { getTypeOfPhotographyByTypeName } from "../../../api";
import Spinner from "../../../components/Spinner/Spinner";

const TypeOfShooting = () => {
  const { name } = useParams();
  const [typeOfPhotography, setTypeOfPhotography] = useState([]);
  useEffect(() => {
    getTypeOfPhotographyByTypeName(name)
      .then((data) => {
        setTypeOfPhotography(data?.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [loading, setLoading] = useState(true);
  const imageLoaded = () => {
    setLoading(false);
  };

  return (
    <>
    <div style={{ display: loading ? "block" : "none" }}>
      <Spinner/>
    </div>
    <div style={{ display: loading ? "none" : "block" }}>
    <div>
      <Header />
      <div className={classes.type}>
        <p className={classes.type__name}>{name}</p>
        <div className={classes.type__grid}>
          <p className={classes.type__grid__text}>
            {typeOfPhotography?.text?.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < typeOfPhotography.text.split("\n").length - 1 && (
                  <br />
                )}
              </React.Fragment>
            ))}
          </p>
          <img
            src={typeOfPhotography?.mainPhoto}
            className={classes.type__grid__photo}
            onLoad={imageLoaded}
          />
        </div>
      </div>
      <Footer />
    </div>
      </div>
    </>
  );
};

export default TypeOfShooting;