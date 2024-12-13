import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Summary: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState();

  useEffect(() => {
    const estimation = sessionStorage.getItem("buildblock-estimation");
    if (!estimation) {
      return;
    }
    fetch("https://iuu1fxt4p2.execute-api.us-east-2.amazonaws.com/prod/compute/buildblock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JSON.parse(estimation).walls),
    })
      .then((e) => e.json())
      .then(function (e) {
        console.log(e);
        if (e.statusCode === 400) {
          return;
        }
        setData(JSON.parse(e.body));
      })
      .catch(function (e) {
        console.error(e);
      });
  }, []);

  const blockTypes = [
    { key: "straight", label: t("Blocs droits") },
    { key: "ninetyCorner", label: t("Coins 90") },
    { key: "fortyFiveCorner", label: t("Coins 45") },
    { key: "brickLedge", label: t("Support à Maçon") },
    { key: "doubleTaperTop", label: t("Double Biseaux") },
    { key: "buck", label: t("Bucks") },
  ];

  const usedBlockTypes: string[] = [];
  return (
    <TableContainer component={Paper} style={{ marginTop: "20px" }}>
      {data && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("Type de bloc")}</TableCell>
              <TableCell>{t("Largeur")}</TableCell>
              <TableCell>{t("Quantité")}</TableCell>
              <TableCell>{t("Paquets")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blockTypes.map((type) => {
              return Object.keys(data).map((width, index) => {
                if (data[width][type.key]) {
                  return (
                    <TableRow key={`${type.key}-${width}`}>
                      {!usedBlockTypes.includes(type.key)
                        ? usedBlockTypes.push(type.key) && (
                            <TableCell
                              rowSpan={Object.keys(data).filter((h) => data[h][type.key]).length}
                            >
                              {type.label}
                            </TableCell>
                          )
                        : null}
                      <TableCell>{width}</TableCell>
                      <TableCell>{data[width][type.key] || 0}</TableCell>
                      <TableCell>{"TBD"}</TableCell>
                    </TableRow>
                  );
                }
                return null;
              });
            })}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default Summary;
