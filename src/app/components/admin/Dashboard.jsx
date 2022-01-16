import React, { useState, useEffect } from "react";
import "./dashboard.scss";
import PeopleIcon from "@material-ui/icons/People";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import ReactApexChart from "react-apexcharts";
import { auth, firestore, storage } from "../../firebase/config";
import { GoPackage } from "react-icons/go";

function Dashboard() {
  const [usernum, setUsernum] = useState([]);
  const [prodnum, setProdnum] = useState([]);
  const [orders, setOrders] = useState([]);
  const db = firestore;

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("users").get();
      setUsernum(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("users").onSnapshot((snapshot) => {
        const newUser = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUsernum(newUser);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("productinfo").onSnapshot((snapshot) => {
        const newProduct = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProdnum(newProduct);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("orders").onSnapshot((snapshot) => {
        const newOrder = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setOrders(newOrder);
      });
    };
    fetchData();
  }, []);

  const [totalsales, setTotalsales] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("sales").onSnapshot((snapshot) => {
        const newSale = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTotalsales(newSale);
      });
    };
    fetchData();
  }, []);

  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      db.collection("productinfo").onSnapshot((snapshot) => {
        const newProduct = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProducts(newProduct);
      });
    };
    fetchData();
  }, [db]);

  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      db.collection("transactions")
        .orderBy("sale", "desc")
        .limit(5)
        .onSnapshot((snapshot) => {
          const newTransaction = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setTransactions(newTransaction);
        });
    };
    fetchData();
  }, [db]);
  const [max, setMax] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      db.collection("transactions")
        .orderBy("sale", "desc")
        .limit(1)
        .onSnapshot((snapshot) => {
          const newMax = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMax(newMax);
        });
    };
    fetchData();
  }, [db]);

  let mx = 0;
  max.map((val) => (mx = val.sale));

  let formatter = Intl.NumberFormat("en", { notation: "compact" });

  const series = [
    100, 5, 44, 55, 13, 43, 22, 15, 10, 50, 70, 10, 17, 25, 60, 30,

    10,
  ];
  const options = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: [
      "NCR",
      "CAR",
      "Region I",
      "Region II",
      "Region III",
      "Region IV-A",
      "Region IV-B",
      "Region V",
      "Region VI",
      "Region VII",
      "Region VIII",
      "Region IX",
      "Region X",
      "Region XI",
      "Region XII",
      "Region XIII",
      "BARMM",
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series2 = [
    {
      name: "Product 1",
      data: [28, 29, 33, 36, 32, 32, 33],
    },
    {
      name: "Product 2",
      data: [26, 27, 30, 35, 30, 31, 30],
    },
    {
      name: "Product 3",
      data: [25, 24, 28, 34, 30, 29, 31],
    },
    {
      name: "Product 4",
      data: [23, 22, 27, 33, 28, 24, 26],
    },
    {
      name: "Product 5",
      data: [9, 11, 13, 20, 6, 7, 13],
    },
  ];
  const options2 = {
    chart: {
      height: 400,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#2962ff", "#ff5452", "#8b52eb", "#14ac7b", "#1a2234"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Sales graph",
      align: "left",
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    markers: {
      size: 1,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      title: {
        text: "Month",
      },
    },
    yaxis: {
      title: {
        text: "Sales",
      },
      min: 0,
      max: mx + 20000,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
  };

  let ss = [{ name: "", data: [0] }];
  var counter = 0;
  // transactions.map((val) => {
  //   // ss[counter].name = val.title;
  //   options2.xaxis.categories.map((month) => {
  //     const counter2=0
  //     if (month === val.month.substring(0, 3)) {
  //       ss[counter].data[]
  //     }
  //   });

  //   counter = counter + 1;
  // });

  // ss = transactions.map((val) => ({
  //   name: val.title,
  // }));

  // ss = options2.xaxis.categories.map((val) =>
  //   transactions.map((item) =>
  //     val === item.month.substring(0, 3)
  //       ? {
  //           name: item.title,
  //           data: item.sale,
  //         }
  //       : {
  //           name: "",
  //           data: 0,
  //         }
  //   )
  // );

  ss = transactions.map((val) => ({
    name: val.title + "(" + val.month.substring(0, 3) + ")",
    data: options2.xaxis.categories.map((item) =>
      item === val.month.substring(0, 3) ? val.sale : 0
    ),
  }));

  console.log("ssss: ", ss);

  let dataV = ss.map((val) => val.data);
  console.log("data: ", dataV);
  console.log("max: ", mx);

  // let max = 0;
  // for (let i = 0; i < dataV.length; i++) {
  //   if (Math.max.apply(null, dataV[i]) > max) {
  //     max = max = Math.max.apply(null, dataV[i]);
  //   } else {
  //     max = max + 0;
  //   }
  // }

  // console.log("max: ", max);

  return (
    <div>
      <h3 className="dashTitle">Hi Admin, Welcome back</h3>
      <div className="dashCont">
        <div className="dashTopCont">
          <div className="card1">
            <div className="circle1">
              <MonetizationOnIcon />
            </div>
            <div className="cardLabel">
              {totalsales.length > 0 ? (
                totalsales.map((sale) => (
                  <p className="L1">{formatter.format(sale.totalsales)}</p>
                ))
              ) : (
                <p className="L1">0</p>
              )}

              <p className="L2">Total sales</p>
            </div>
          </div>
          <div className="card2">
            <div className="circle2">
              <PeopleIcon />
            </div>
            <div className="card2Label">
              <p className="L1">{usernum.length}</p>
              <p className="L2">Users</p>
            </div>
          </div>
          <div className="card3">
            <div className="circle3">
              <LocalShippingIcon />
            </div>
            <div className="card3Label">
              <p className="L1">{orders.length}</p>
              <p className="L2">Total orders</p>
            </div>
          </div>
          <div className="card4">
            <div className="circle4">
              <GoPackage />
            </div>
            <div className="card4Label">
              <p className="L1">{prodnum.length}</p>
              <p className="L2">Products</p>
            </div>
          </div>
        </div>
        <div className="dashBotCont">
          <div className="graphCont">
            <h2 className="graphTitle">Top 5 products</h2>
            <div className="graphWrapper">
              <div className="graph">
                <ReactApexChart
                  options={options2}
                  series={ss}
                  type="line"
                  height={800}
                  width={800}
                />
              </div>
            </div>
          </div>
          {/* <button
            onClick={() => {
              products.map((val) =>
                db.collection("productinfo").doc(val.id).update({
                  sold: 0,
                })
              );
            }}
          >
            aa
          </button> */}
          {/* <div className="pieChartCont">
            <h2 className="pieTitle">Current visits</h2>
            <div className="pieWrapper">
              <div className="chart">
                <ReactApexChart
                  options={options}
                  series={series}
                  type="pie"
                  width={380}
                  height={500}
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
