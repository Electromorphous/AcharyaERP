import { useState, useEffect, useMemo } from "react";
import { Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/styles";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import GridIndex from "../../components/GridIndex";
import axios from "../../services/Api";

const graphOptions = [
  { value: "Department", label: "Department" },
  { value: "Designation", label: "Designation" },
  { value: "Gender", label: "Gender" },
  { value: "AgeGroup", label: "AgeGroup" },
  { value: "JoiningDate", label: "JoiningDate" },
  { value: "ExitingDate", label: "ExitingDate" },
  { value: "MaritalStatus", label: "MaritalStatus" },
  { value: "JobType", label: "JobType" },
  { value: "Shift", label: "Shift" },
  { value: "EmployeeType", label: "EmployeeType" },
];
const DEFAULT_GRAPH = "EmployeeType";

function ChartsTest() {
  const [selectedGraph, setSelectedGraph] = useState(DEFAULT_GRAPH);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [barData, setBarData] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  // const [year, setYear] = useState(new Date().getFullYear());
  const [year, setYear] = useState(2016);

  const yearOptions = useMemo(() => {
    let temp = [];
    const curr = new Date().getFullYear();
    for (let i = curr - 10; i <= curr; i++) {
      temp.push(i);
    }

    return temp;
  }, []);

  // setting the keys prop for the bar chart, everytime the bar data updates.
  const keys = useMemo(() => {
    let temp = [];

    barData.forEach((obj) => {
      temp.push(...Object.keys(obj));
    });
    temp = [...new Set(temp)];
    temp.splice(temp.indexOf("school"), 1);
    temp.splice(temp.indexOf("school_name_short"), 1);

    return temp;
  }, [barData]);

  // setting columns for the table
  const allColumns = useMemo(() => {
    let temp = [
      {
        field: "school",
        headerName: "School",
        flex: 1,
      },
    ];

    // if (selectedSchool) {
    //   temp.push({
    //     field: selectedSchool,
    //     headerName: selectedSchool,
    //     flex: 1,
    //   });
    // } else {
    //   schoolOptions
    //     .filter((op) => op.value !== "")
    //     .forEach((school) =>
    //       temp.push({
    //         field: school.value,
    //         headerName: school.value,
    //         flex: 1,
    //       })
    //     );
    // }

    keys.forEach((key) => {
      temp.push({
        field: key,
        headerName: key,
        flex: 1,
      });
    });

    return temp;
  }, [selectedGraph, keys]);

  const rows = useMemo(() => {
    if (selectedSchool) {
      return barData
        .filter((obj) => obj.school === selectedSchool)
        .map((row, index) => ({ ...row, id: index }));
    }
    return barData.map((row, index) => ({ ...row, id: index }));
  }, [barData, selectedSchool]);

  // setting the pie data every time a school is selected
  const pieData = useMemo(() => {
    if (selectedGraph === "JoiningData" || selectedGraph === "LeavingData") {
      // call pie chart api here
    } else {
      const data = barData.filter((obj) => obj.school === selectedSchool)[0];
      if (data) {
        const keyNames = Object.keys(data);
        return keyNames
          .filter((key) => key !== "school" && key !== "school_name_short")
          .map((key) => {
            return {
              id: key,
              label: key,
              value: data[key],
            };
          });
      }
      return [];
    }
  }, [barData, selectedGraph, selectedSchool]);

  const theme = useTheme();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([]), []);

  // setting school options, only when the default graph is selected,
  // so that the options do not turn into months when joining/exiting graphs are selected.
  // working on the assumtion that schools are same for all graphs.
  useEffect(() => {
    if (selectedGraph === DEFAULT_GRAPH) {
      setSchoolOptions([
        { value: "", label: "All" },
        ...barData.map((obj) => ({ value: obj.school, label: obj.school })),
      ]);
    }
  }, [barData, selectedGraph]);

  useEffect(() => {
    if (selectedGraph === "Department") getDepartmentData();
    else if (selectedGraph === "Designation") getDesignationData();
    else if (selectedGraph === "Gender") getGenderData();
    else if (selectedGraph === "AgeGroup") getDateOfBirthData();
    else if (selectedGraph === "JoiningDate") getJoiningDateData();
    else if (selectedGraph === "ExitingDate") getExitingDateData();
    else if (selectedGraph === "Schools") getSchoolsData();
    else if (selectedGraph === "ExperienceInMonth") getExperienceInMonthData();
    else if (selectedGraph === "ExperienceInYear") getExperienceInYearData();
    else if (selectedGraph === "MaritalStatus") getMaritalStatusData();
    else if (selectedGraph === "JobType") getJobTypeData();
    else if (selectedGraph === "Shift") getShiftData();
    else if (selectedGraph === "EmployeeType") getEmployeeTypeData();
  }, [selectedGraph, year]);

  const handleBarData = (apiData) => {
    // if (!date) {
    setBarData(
      apiData.map((obj) => ({
        school: obj.school_name_short,
        ...obj,
      }))
    );
    // }
    // else {
    //   setBarData(
    //     apiData.map((obj) => {
    //       let temp = {};
    //       temp.school = obj.school_name_short;
    //       let keysArray = Object.keys(obj);
    //       keysArray.splice(keysArray.indexOf("school_name_short"), 1);

    //       for (let i = 0; i < keysArray.length; i++) {
    //         temp = {
    //           ...temp,
    //           [convertToLongDateFormat(new Date(keysArray[i]))]:
    //             obj[keysArray[i]],
    //         };
    //       }
    //       return temp;
    //     })
    //   );
    // }
  };

  const getDepartmentData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnDepartment")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getDesignationData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnDesignation")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getGenderData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnGender")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getDateOfBirthData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnDateOfBirth")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getJoiningDateData = async () => {
    await axios
      .get(
        `/api/employee/getEmployeeDetailsForReportOnMonthWiseOfJoiningYear/${year}`
      )
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getExitingDateData = async () => {
    await axios
      .get(
        `/api/employee/getEmployeeRelievingReportDataOnMonthWiseInactiveData/${year}`
      )
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getSchoolsData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnSchools")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getExperienceInMonthData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnExperienceInMonth")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getExperienceInYearData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnExperienceInYear")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getMaritalStatusData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnMaritalStatus")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getJobTypeData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnJobType")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getShiftData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnShift")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getEmployeeTypeData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnEmployeeType")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid item xs={12} sm={6} md={4} sx={{ zIndex: 3 }}>
          <Grid
            container
            columnGap={1}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item flex={1}>
              <FormControl size="small" fullWidth>
                <InputLabel>Graph</InputLabel>
                <Select
                  size="small"
                  name="graph"
                  value={selectedGraph}
                  label="Graph"
                  onChange={(e) => setSelectedGraph(e.target.value)}
                >
                  {graphOptions.map((obj, index) => (
                    <MenuItem key={index} value={obj.value}>
                      {obj.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {selectedGraph === "JoiningDate" ||
            selectedGraph === "ExitingDate" ? (
              <Grid item xs={4} sx={{ zIndex: 3 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Year</InputLabel>
                  <Select
                    size="small"
                    name="year"
                    value={year}
                    label="Year"
                    onChange={(e) => setYear(e.target.value)}
                  >
                    {yearOptions.map((year, index) => (
                      <MenuItem key={index} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6} md={4} sx={{ zIndex: 3 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>School</InputLabel>
            <Select
              size="small"
              name="school"
              value={selectedSchool}
              label="School"
              onChange={(e) => setSelectedSchool(e.target.value)}
            >
              {schoolOptions.map((obj, index) => (
                <MenuItem key={index} value={obj.value}>
                  {obj.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Grid container width="100%">
            {selectedSchool ? (
              <Grid item xs={12} md={6} sx={{ height: 450 }}>
                <ResponsivePie
                  data={pieData}
                  // colors={{ datum: "data.color" }}
                  colors={{ scheme: "nivo" }}
                  margin={{ top: 47, right: 73, left: 73, bottom: 47 }}
                  innerRadius={0.5}
                  padAngle={1}
                  cornerRadius={7}
                  activeInnerRadiusOffset={5}
                  activeOuterRadiusOffset={11}
                  borderWidth={2}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#222"
                  arcLinkLabelsThickness={3}
                  arcLinkLabelsColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                  }}
                  arcLabelsTextColor={{
                    from: "color",
                    modifiers: [["darker", 2]],
                  }}
                  defs={[]}
                />
              </Grid>
            ) : (
              <Grid item xs={12} sx={{ height: 500, mt: -5 }}>
                <ResponsiveBar
                  data={barData}
                  keys={keys}
                  // colors={{ datum: "data.color" }}
                  colors={{ scheme: "nivo" }}
                  indexBy="school"
                  margin={{ top: 47, right: 73, left: 73, bottom: 47 }}
                  padding={0.3}
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  // colors={{ scheme: "nivo" }}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "School",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Employees",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  role="application"
                />
              </Grid>
            )}
            <Grid item xs={12} md={selectedSchool ? 6 : 12} p={2}>
              <GridIndex
                rows={rows}
                columns={
                  selectedSchool
                    ? Object.keys(rows[0])
                        .filter(
                          (key) => key !== "school_name_short" && key !== "id"
                        )
                        .map((key) => ({
                          field: key,
                          headerName: key,
                          flex: 1,
                        }))
                    : allColumns
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ChartsTest;
