import React, { useEffect, useReducer } from "react";
import Drawer from "../Drawer";
import { Button, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import FormTextField from "src/components/FormTextField";
import "./BuildBlockForm.css";
import "./../../BuildBlock.css";
import "./../../../../global.css";
import { useTranslation } from "react-i18next";
import { WallState } from "../../types/BBTypes";
import { openingReducer, initialOpeningState, buildBlockFormReducer, initialBuildBlockFormState } from "./../../reducer";
import WallTab from "../WallTab";
import { wallReducer, initialWallState } from "../../reducer";
import { Routes } from "src/interfaces/routes";
import { Constants } from "src/constants";

interface BuildBlockFormProps {
  setInnerPage: React.Dispatch<string>;
}

const BuildBlockForm: React.FC<BuildBlockFormProps> = ({ setInnerPage }) => {
  const { t } = useTranslation();
  const [wallState, wallDispatch] = useReducer(wallReducer, initialWallState, () => {
    const prev = sessionStorage.getItem("buildblock-estimation");
    if (prev) {
      const parsedPrev = JSON.parse(prev);
      return parsedPrev as WallState;
    }
    return initialWallState;
  });

  const [openingState, openingDispatch] = useReducer(
    openingReducer,
    initialOpeningState,
    () => wallState.walls[wallState.clickedWallIndex].openingState
  );

  const [buildBlockFormState, buildBlockFormDispatch] = useReducer(
    buildBlockFormReducer,
    initialBuildBlockFormState,
    () => wallState.walls[wallState.clickedWallIndex].buildBlockFormState
  );

  const handleAddOpeningClick = () => {
    openingDispatch({ type: "addOpening" });
  };

  const handleDeleteOpeningClick = () => {
    if (openingState.openings.length > 1) {
      openingDispatch({ type: "deleteOpening" });
    } else {
      openingDispatch({ type: "resetOpening" });
    }
  };

  useEffect(() => {
    sessionStorage.setItem("buildblock-estimation", JSON.stringify(wallState));
  }, [wallState, buildBlockFormState, openingState]);

  const handleComputeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setInnerPage(Routes.SUMMARY);
  };

  return (
    <div className="main-page-container">
      <WallTab
        buildBlockFormState={buildBlockFormState}
        openingState={openingState}
        wallState={wallState}
        buildBlockFormDispatch={buildBlockFormDispatch}
        openingDispatch={openingDispatch}
        wallDispatch={wallDispatch}
      />
      <form>
        <Drawer title={t("Type de mur")} isOpen={true}>
          <RadioGroup
            row
            value={buildBlockFormState.wallType}
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setWallType",
                payload: e.target.value,
              });
            }}
          >
            <FormControlLabel value={"Reg"} control={<Radio />} label={t("Régulier")} />
            {/* <FormControlLabel value={"KD"} control={<Radio />} label={t("Déconstruit")} /> */}
            <FormControlLabel value={"Pign"} control={<Radio />} label={t("Pignon")} />
          </RadioGroup>
        </Drawer>
        <Drawer title={t("Dimensions du Mur")} isOpen={true}>
          <label>{t("Largeur")}</label>
          <Select
            value={buildBlockFormState.width}
            fullWidth
            size="small"
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setWidth",
                payload: e.target.value,
              });
            }}
            color="primary"
          >
            <MenuItem value={""}>ㅤ</MenuItem>
            <MenuItem value={'4"'}>4"</MenuItem>
            <MenuItem value={'6"'}>6"</MenuItem>
            <MenuItem value={'8"'}>8"</MenuItem>
            {buildBlockFormState.wallType === "KD"
              ? [
                  <MenuItem key="10" value='10"'>
                    10"
                  </MenuItem>,
                  <MenuItem key="12" value='12"'>
                    12"
                  </MenuItem>,
                ]
              : null}
          </Select>
          <label htmlFor="height">{t("Hauteur")}</label>
          <FormTextField
            id="height"
            fullWidth
            size="small"
            className="input-spacing"
            required
            value={buildBlockFormState.height}
            onChange={(e) => {
              buildBlockFormDispatch({ type: "setHeight", payload: e.target.value });
            }}
          />
          <label htmlFor="length">{t("Longueur")}</label>
          <FormTextField
            id="length"
            fullWidth
            size="small"
            className="input-spacing"
            required
            value={buildBlockFormState.length}
            onChange={(e) => {
              buildBlockFormDispatch({ type: "setLength", payload: e.target.value });
            }}
          />
        </Drawer>
        {buildBlockFormState.wallType !== "Pign" && (
          <Drawer title={t("Nombre de Coins")} isOpen={true}>
            <div className="flex-horizontal">
              <div className="flex-vertical full-width">
                <label htmlFor="inside-90">{t("Interne 90")}</label>
                <FormTextField
                  id="inside-90"
                  fullWidth
                  size="small"
                  className="input-spacing"
                  value={buildBlockFormState.nInsideCorners}
                  onChange={(e) => {
                    buildBlockFormDispatch({
                      type: "setNInsideCorners",
                      payload: e.target.value,
                    });
                  }}
                />
                <label htmlFor="outside-90">{t("Externe 90")}</label>
                <FormTextField
                  id="outside-90"
                  fullWidth
                  size="small"
                  className="input-spacing"
                  value={buildBlockFormState.nOutsideCorners}
                  onChange={(e) => {
                    buildBlockFormDispatch({
                      type: "setNOutsideCorners",
                      payload: e.target.value,
                    });
                  }}
                />
              </div>
              {!(['12"', '10"'].includes(buildBlockFormState.width) && buildBlockFormState.wallType === "KD") && (
                <div className="flex-vertical full-width margin-left">
                  <label htmlFor="inside-45">{t("Interne 45")}</label>
                  <FormTextField
                    id="inside-45"
                    fullWidth
                    size="small"
                    className="input-spacing"
                    value={buildBlockFormState.n45InsideCorners}
                    onChange={(e) => {
                      buildBlockFormDispatch({
                        type: "setN45InsideCorners",
                        payload: e.target.value,
                      });
                    }}
                  />
                  <label htmlFor="outside-45">{t("Externe 45")}</label>
                  <FormTextField
                    id="outside-45"
                    fullWidth
                    size="small"
                    className="input-spacing"
                    value={buildBlockFormState.n45OutsideCorners}
                    onChange={(e) => {
                      buildBlockFormDispatch({
                        type: "setN45OutsideCorners",
                        payload: e.target.value,
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </Drawer>
        )}
        <Drawer title={t("Ouvertures")} isOpen={true}>
          {openingState.openings.map((_, index) => {
            return (
              <div key={index} className="flex-horizontal">
                <div className="flex-vertical full-width">
                  <label htmlFor="opening-width">{t("Largeur")}</label>
                  <FormTextField
                    id="opening-width"
                    fullWidth
                    size="small"
                    className="input-spacing"
                    value={openingState.openings[index].width}
                    onChange={(e) => {
                      openingDispatch({
                        type: "modifyOpening",
                        payload: { attribute: "width", value: e.target.value, index: index },
                      });
                    }}
                  />
                </div>
                <div className="flex-vertical full-width margin-left">
                  <label htmlFor="opening-height">{t("Hauteur")}</label>
                  <FormTextField
                    id="opening-height"
                    fullWidth
                    size="small"
                    className="input-spacing"
                    value={openingState.openings[index].height}
                    onChange={(e) => {
                      openingDispatch({
                        type: "modifyOpening",
                        payload: { attribute: "height", value: e.target.value, index: index },
                      });
                    }}
                  />
                </div>
                <div className="flex-vertical full-width margin-left">
                  <label htmlFor="opening-quantity">{t("Quantité")}</label>
                  <FormTextField
                    id="opening-quantity"
                    fullWidth
                    size="small"
                    className="input-spacing"
                    value={openingState.openings[index].quantity}
                    onChange={(e) => {
                      openingDispatch({
                        type: "modifyOpening",
                        payload: { attribute: "quantity", value: e.target.value, index: index },
                      });
                    }}
                  />
                </div>
              </div>
            );
          })}
          <div className="space-between">
            <Button variant="contained" color="success" onClick={handleAddOpeningClick}>
              {t("Ajouter")}
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteOpeningClick}>
              {t("Supprimer")}
            </Button>
          </div>
        </Drawer>
        {!['4"'].includes(buildBlockFormState.width) && (
          <Drawer title={t("Support à Maçon")} isOpen>
            <label htmlFor="brick-ledge-length">{t("Longueur")}</label>
            <FormTextField
              id="brick-ledge-length"
              fullWidth
              size="small"
              className="input-spacing"
              value={buildBlockFormState.brickLedge.length}
              onChange={(e) => {
                buildBlockFormDispatch({
                  type: "setBrickLedgeLength",
                  payload: e.target.value,
                });
              }}
            />

            <label htmlFor="brick-ledge-90">{t("Coins") + " 90"}</label>
            <FormTextField
              id="brick-ledge-90"
              fullWidth
              size="small"
              className="input-spacing"
              value={buildBlockFormState.brickLedge.nCorners}
              onChange={(e) => {
                buildBlockFormDispatch({
                  type: "setBrickLedgeNCorners",
                  payload: e.target.value,
                });
              }}
            />
            {!(buildBlockFormState.wallType === "KD" && ['10"', '12"'].includes(buildBlockFormState.width)) && (
              <>
                <label htmlFor="brick-ledge-45">{t("Coins") + " 45"}</label>
                <FormTextField
                  id="brick-ledge-45"
                  fullWidth
                  size="small"
                  className="input-spacing"
                  value={buildBlockFormState.brickLedge.n45Corners}
                  onChange={(e) => {
                    buildBlockFormDispatch({
                      type: "setBrickLedgeN45Corners",
                      payload: e.target.value,
                    });
                  }}
                />
              </>
            )}
          </Drawer>
        )}
        {!['4"'].includes(buildBlockFormState.width) && !(buildBlockFormState.wallType === "Pign") && (
          <Drawer title={t("Double Biseau")} isOpen>
            <label htmlFor="double-taper-length">{t("Longueur")}</label>
            <FormTextField
              id="double-taper-length"
              fullWidth
              size="small"
              className="input-spacing"
              value={buildBlockFormState.doubleTaperTop.length}
              onChange={(e) => {
                buildBlockFormDispatch({
                  type: "setDoubleTaperTopLength",
                  payload: e.target.value,
                });
              }}
            />
            <label htmlFor="double-taper-90">{t("Coins")}</label>
            <FormTextField
              id="double-taper-90"
              fullWidth
              size="small"
              className="input-spacing"
              value={buildBlockFormState.doubleTaperTop.nCorners}
              onChange={(e) => {
                buildBlockFormDispatch({
                  type: "setDoubleTaperTopNCorners",
                  payload: e.target.value,
                });
              }}
            />
          </Drawer>
        )}
        <Drawer title={t("Insertions Isolantes")} isOpen>
          <label htmlFor="thermalsert-layer-quantity">{t("Nombre de couches")}</label>
          <FormTextField
            id="thermalsert-layer-quantity"
            fullWidth
            size="small"
            className="input-spacing"
            value={buildBlockFormState.thermalsert.nLayers}
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setNThermalsertLayers",
                payload: e.target.value,
              });
            }}
          />
          <label>{t("Largeur")}</label>
          <Select
            value={buildBlockFormState.thermalsert.width}
            fullWidth
            size="small"
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setThermalsertWidth",
                payload: e.target.value,
              });
            }}
            color="primary"
          >
            <MenuItem value={""}>ㅤ</MenuItem>
            {Constants.THERMALSERT_WIDTH_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Drawer>
        <Drawer title={t("Armatures Horizontales")} isOpen>
          <label htmlFor="horizontal-rebar-quantity">{t("Nombre de rangées")}</label>
          <FormTextField
            id="horizontal-rebar-quantity"
            fullWidth
            size="small"
            className="input-spacing"
            value={buildBlockFormState.horizontalRebar.quantity}
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setHorizontalRebarQuantity",
                payload: e.target.value,
              });
            }}
          />
          <label> {t("Armature spécifiée")}</label>
          <Select
            value={buildBlockFormState.horizontalRebar.diameter}
            fullWidth
            size="small"
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setHorizontalRebarDiameter",
                payload: e.target.value,
              });
            }}
            color="primary"
          >
            <MenuItem value={""}>ㅤ</MenuItem>
            {Constants.REBAR_DIAMETER_OPTIONS.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Drawer>
        <Drawer title={t("Armatures Verticales")} isOpen>
          <label htmlFor="vertical-rebar-spacing">{t("Espacement")}</label>
          <FormTextField
            id="vertical-rebar-spacing"
            fullWidth
            size="small"
            className="input-spacing"
            value={buildBlockFormState.verticalRebar.spacing}
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setVerticalRebarSpacing",
                payload: e.target.value,
              });
            }}
          />
          <label>{t("Armature spécifiée")}</label>
          <Select
            value={buildBlockFormState.verticalRebar.diameter}
            fullWidth
            size="small"
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setVerticalRebarDiameter",
                payload: e.target.value,
              });
            }}
            color="primary"
          >
            <MenuItem value={""}>ㅤ</MenuItem>
            <MenuItem value={"0.375"}>#3</MenuItem>
            <MenuItem value={"0.5"}>#4</MenuItem>
            <MenuItem value={"0.625"}>#5</MenuItem>
            <MenuItem value={"0.75"}>#6</MenuItem>
            <MenuItem value={"0.875"}>#7</MenuItem>
            <MenuItem value={"1.0"}>#8</MenuItem>
          </Select>
        </Drawer>
        <Drawer title={t("Goujons")} isOpen>
          <label htmlFor="cjp-center-spacing">{t("Espacement")}</label>
          <FormTextField
            id="cjp-center-spacing"
            fullWidth
            size="small"
            className="input-spacing"
            value={buildBlockFormState.coldJointPin.centerSpacing}
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setCJPCenterSpacing",
                payload: e.target.value,
              });
            }}
          />
          <label htmlFor="cjp-l-length">{t("Longueur L")}</label>
          <FormTextField
            id="cjp-l-length"
            fullWidth
            size="small"
            className="input-spacing"
            value={buildBlockFormState.coldJointPin.lLength}
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setCJPLLength",
                payload: e.target.value,
              });
            }}
          />
          <label htmlFor="cjp-depth-in-footing">{t("Profondeur dans la semelle")}</label>
          <FormTextField
            id="cjp-depth-in-footing"
            fullWidth
            size="small"
            className="input-spacing"
            value={buildBlockFormState.coldJointPin.depthInFooting}
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setCJPDepthInFooting",
                payload: e.target.value,
              });
            }}
          />
          <label>{t("Armature spécifiée")}</label>
          <Select
            value={buildBlockFormState.coldJointPin.diameter}
            fullWidth
            size="small"
            onChange={(e) => {
              buildBlockFormDispatch({
                type: "setCJPDiameter",
                payload: e.target.value,
              });
            }}
            color="primary"
          >
            <MenuItem value={""}>ㅤ</MenuItem>
            <MenuItem value={"0.375"}>#3</MenuItem>
            <MenuItem value={"0.5"}>#4</MenuItem>
            <MenuItem value={"0.625"}>#5</MenuItem>
            <MenuItem value={"0.75"}>#6</MenuItem>
            <MenuItem value={"0.875"}>#7</MenuItem>
            <MenuItem value={"1.0"}>#8</MenuItem>
          </Select>
        </Drawer>
        <div className="flex-end" style={{ marginBottom: 100, marginTop: 20 }}>
          <Button type="submit" variant="contained" color="secondary" onClick={handleComputeClick}>
            {t("Calculer")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BuildBlockForm;
