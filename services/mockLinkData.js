const links = [
  {
    "metric": {
      "dst_rack": "cern",
      "max": "100000000000",
      "src_rack": "amst",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8666,
        "in_day_max_value": 31580,
        "in_hr_avg_value": 8872,
        "in_hr_max_value": 10452,
        "in_now_value": 7630,
        "out_day_avg_value": 17104,
        "out_day_max_value": 22189,
        "out_hr_avg_value": 16469,
        "out_hr_max_value": 20572,
        "out_now_value": 20142
      }
    }
  },
  {
    "metric": {
      "dst_rack": "atla",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 33816,
        "in_day_max_value": 124382,
        "in_hr_avg_value": 35424,
        "in_hr_max_value": 45547,
        "in_now_value": 35943,
        "out_day_avg_value": 63637,
        "out_day_max_value": 242295,
        "out_hr_avg_value": 62337,
        "out_hr_max_value": 80692,
        "out_now_value": 59613
      }
    }
  },
  {
    "metric": {
      "dst_rack": "dall",
      "src_rack": "atla",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 3587113,
        "in_day_max_value": 5127875380,
        "in_hr_avg_value": 25603,
        "in_hr_max_value": 32766,
        "in_now_value": 24826,
        "out_day_avg_value": 59441,
        "out_day_max_value": 5888431,
        "out_hr_avg_value": 55123,
        "out_hr_max_value": 64997,
        "out_now_value": 49511
      }
    }
  },
  {
    "metric": {
      "dst_rack": "losa",
      "src_rack": "salt",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 4092766,
        "in_day_max_value": 4555746010,
        "in_hr_avg_value": 27297,
        "in_hr_max_value": 31212,
        "in_now_value": 26746,
        "out_day_avg_value": 56930,
        "out_day_max_value": 5666564,
        "out_hr_avg_value": 48361,
        "out_hr_max_value": 58392,
        "out_now_value": 48576
      }
    }
  },
  {
    "metric": {
      "dst_rack": "newy",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 29058377,
        "in_day_max_value": 41803724842,
        "in_hr_avg_value": 28295,
        "in_hr_max_value": 38077,
        "in_now_value": 27412,
        "out_day_avg_value": 59373,
        "out_day_max_value": 3494554,
        "out_hr_avg_value": 53232,
        "out_hr_max_value": 74606,
        "out_now_value": 50642
      }
    }
  },
  {
    "metric": {
      "dst_rack": "salt",
      "src_rack": "losa",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 47813,
        "in_day_max_value": 6925454,
        "in_hr_avg_value": 42262,
        "in_hr_max_value": 61006,
        "in_now_value": 43190,
        "out_day_avg_value": 3186508,
        "out_day_max_value": 3423231574,
        "out_hr_avg_value": 35374,
        "out_hr_max_value": 46759,
        "out_now_value": 31268
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "src_rack": "newy",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 52325,
        "in_day_max_value": 8157057,
        "in_hr_avg_value": 45334,
        "in_hr_max_value": 64808,
        "in_now_value": 28762,
        "out_day_avg_value": 9691950,
        "out_day_max_value": 11169695114,
        "out_hr_avg_value": 36508,
        "out_hr_max_value": 46636,
        "out_now_value": 36034
      }
    }
  },
  {
    "metric": {
      "dst_rack": "star",
      "src_rack": "salt",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 13055384,
        "in_day_max_value": 18116906042,
        "in_hr_avg_value": 2300107,
        "in_hr_max_value": 13652396,
        "in_now_value": 27657,
        "out_day_avg_value": 30485877,
        "out_day_max_value": 23617632165,
        "out_hr_avg_value": 669876,
        "out_hr_max_value": 6898973,
        "out_now_value": 48117
      }
    }
  },
  {
    "metric": {
      "dst_rack": "atla",
      "src_rack": "dall",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 52837,
        "in_day_max_value": 8436866,
        "in_hr_avg_value": 46302,
        "in_hr_max_value": 53494,
        "in_now_value": 45115,
        "out_day_avg_value": 5712144,
        "out_day_max_value": 8175920583,
        "out_hr_avg_value": 33968,
        "out_hr_max_value": 40376,
        "out_now_value": 30243
      }
    }
  },
  {
    "metric": {
      "dst_rack": "dall",
      "src_rack": "losa",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 84991,
        "in_day_max_value": 4707280,
        "in_hr_avg_value": 77982,
        "in_hr_max_value": 127211,
        "in_now_value": 77436,
        "out_day_avg_value": 8600104,
        "out_day_max_value": 9582929117,
        "out_hr_avg_value": 29835,
        "out_hr_max_value": 38350,
        "out_now_value": 25858
      }
    }
  },
  {
    "metric": {
      "dst_rack": "losa",
      "src_rack": "dall",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8353184,
        "in_day_max_value": 8176083991,
        "in_hr_avg_value": 22104,
        "in_hr_max_value": 24746,
        "in_now_value": 22510,
        "out_day_avg_value": 99427,
        "out_day_max_value": 8372853,
        "out_hr_avg_value": 82940,
        "out_hr_max_value": 107931,
        "out_now_value": 74167
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "src_rack": "atla",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 54995,
        "in_day_max_value": 253259,
        "in_hr_avg_value": 54129,
        "in_hr_max_value": 66795,
        "in_now_value": 52644,
        "out_day_avg_value": 42243,
        "out_day_max_value": 113720,
        "out_hr_avg_value": 43848,
        "out_hr_max_value": 49789,
        "out_now_value": 44236
      }
    }
  },
  {
    "metric": {
      "dst_rack": "newy",
      "src_rack": "star",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8896364,
        "in_day_max_value": 12403318756,
        "in_hr_avg_value": 163846,
        "in_hr_max_value": 1112573,
        "in_now_value": 38722,
        "out_day_avg_value": 19164969,
        "out_day_max_value": 26194370552,
        "out_hr_avg_value": 90353,
        "out_hr_max_value": 176655,
        "out_now_value": 81957
      }
    }
  },
  {
    "metric": {
      "dst_rack": "salt",
      "src_rack": "star",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 39431289,
        "in_day_max_value": 28549695039,
        "in_hr_avg_value": 609348,
        "in_hr_max_value": 6749767,
        "in_now_value": 26910,
        "out_day_avg_value": 15009794,
        "out_day_max_value": 20921291861,
        "out_hr_avg_value": 2331174,
        "out_hr_max_value": 16390639,
        "out_now_value": 33837
      }
    }
  },
  {
    "metric": {
      "dst_rack": "star",
      "src_rack": "newy",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 23053767,
        "in_day_max_value": 31696008600,
        "in_hr_avg_value": 79216,
        "in_hr_max_value": 115941,
        "in_now_value": 44274,
        "out_day_avg_value": 3437221,
        "out_day_max_value": 3641555681,
        "out_hr_avg_value": 345179,
        "out_hr_max_value": 1121763,
        "out_now_value": 1097625
      }
    }
  },
  {
    "metric": {
      "dst_rack": "cern",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8565,
        "in_day_max_value": 11893,
        "in_hr_avg_value": 8475,
        "in_hr_max_value": 10211,
        "in_now_value": 9689,
        "out_day_avg_value": 17581,
        "out_day_max_value": 25139,
        "out_hr_avg_value": 17562,
        "out_hr_max_value": 23202,
        "out_now_value": 20566
      }
    }
  },
  {
    "metric": {
      "dst_rack": "cern",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8322,
        "in_day_max_value": 9772,
        "in_hr_avg_value": 8135,
        "in_hr_max_value": 9739,
        "in_now_value": 9714,
        "out_day_avg_value": 17130,
        "out_day_max_value": 31506,
        "out_hr_avg_value": 16897,
        "out_hr_max_value": 22323,
        "out_now_value": 17596
      }
    }
  },
  {
    "metric": {
      "dst_rack": "cern",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8349,
        "in_day_max_value": 9789,
        "in_hr_avg_value": 8308,
        "in_hr_max_value": 9747,
        "in_now_value": 7317,
        "out_day_avg_value": 31080,
        "out_day_max_value": 109442,
        "out_hr_avg_value": 32847,
        "out_hr_max_value": 44275,
        "out_now_value": 30749
      }
    }
  },
  {
    "metric": {
      "dst_rack": "cern",
      "max": "400000000000",
      "src_rack": "newy",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 373960,
        "in_day_max_value": 20118177,
        "in_hr_avg_value": 161756,
        "in_hr_max_value": 1104406,
        "in_now_value": 44632,
        "out_day_avg_value": 22932887,
        "out_day_max_value": 31578468587,
        "out_hr_avg_value": 41816,
        "out_hr_max_value": 57514,
        "out_now_value": 42791
      }
    }
  },
  {
    "metric": {
      "dst_rack": "newy",
      "max": "400000000000",
      "src_rack": "cern",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 25355575,
        "in_day_max_value": 35008688025,
        "in_hr_avg_value": 33801,
        "in_hr_max_value": 54807,
        "in_now_value": 40453,
        "out_day_avg_value": 770757,
        "out_day_max_value": 23273734,
        "out_hr_avg_value": 412298,
        "out_hr_max_value": 1108798,
        "out_now_value": 1103207
      }
    }
  },
  {
    "metric": {
      "dst_rack": "cien",
      "max": "400000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 16287,
        "out_day_max_value": 21376,
        "out_hr_avg_value": 16329,
        "out_hr_max_value": 21347,
        "out_now_value": 14230
      }
    }
  },
  {
    "metric": {
      "dst_rack": "cien",
      "max": "400000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 16292,
        "out_day_max_value": 21376,
        "out_hr_avg_value": 16329,
        "out_hr_max_value": 21347,
        "out_now_value": 14230
      }
    }
  },
  {
    "metric": {
      "dst_rack": "lbnl",
      "max": "100000000000",
      "src_rack": "uky",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 0,
        "out_day_max_value": 0,
        "out_hr_avg_value": 0,
        "out_hr_max_value": 0,
        "out_now_value": 0
      }
    }
  },
  {
    "metric": {
      "dst_rack": "uky",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 0,
        "out_day_max_value": 0,
        "out_hr_avg_value": 0,
        "out_hr_max_value": 0,
        "out_now_value": 0
      }
    }
  },
  {
    "metric": {
      "dst_rack": "uky",
      "max": "100000000000",
      "src_rack": "lbnl",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 5,
        "out_day_max_value": 29,
        "out_hr_avg_value": 6,
        "out_hr_max_value": 29,
        "out_now_value": 29
      }
    }
  },
  {
    "metric": {
      "dst_rack": "uky",
      "max": "100000000000",
      "src_rack": "star",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 0,
        "out_day_max_value": 0,
        "out_hr_avg_value": 0,
        "out_hr_max_value": 0,
        "out_now_value": 0
      }
    }
  },
  {
    "metric": {
      "dst_rack": "eduky",
      "max": "100000000000",
      "src_rack": "star",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 9785064,
        "in_day_max_value": 14033987213,
        "in_hr_avg_value": 10721,
        "in_hr_max_value": 12789,
        "in_now_value": 8696,
        "out_day_avg_value": 21264940,
        "out_day_max_value": 27888084752,
        "out_hr_avg_value": 24200,
        "out_hr_max_value": 32114,
        "out_now_value": 20844
      }
    }
  },
  {
    "metric": {
      "dst_rack": "eduky",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 24377,
        "in_day_max_value": 19558883,
        "in_hr_avg_value": 10899,
        "in_hr_max_value": 13137,
        "in_now_value": 9845,
        "out_day_avg_value": 10252214,
        "out_day_max_value": 9799508257,
        "out_hr_avg_value": 25970,
        "out_hr_max_value": 34470,
        "out_now_value": 22840
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "100000000000",
      "src_rack": "fiu",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 30788,
        "in_day_max_value": 1346406,
        "in_hr_avg_value": 17991,
        "in_hr_max_value": 22082,
        "in_now_value": 16063,
        "out_day_avg_value": 34450,
        "out_day_max_value": 1423727,
        "out_hr_avg_value": 20431,
        "out_hr_max_value": 24503,
        "out_now_value": 23793
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "100000000000",
      "src_rack": "max",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 87045,
        "in_day_max_value": 243797,
        "in_hr_avg_value": 86211,
        "in_hr_max_value": 92986,
        "in_now_value": 83962,
        "out_day_avg_value": 126314,
        "out_day_max_value": 248118,
        "out_hr_avg_value": 126336,
        "out_hr_max_value": 132001,
        "out_now_value": 123219
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "100000000000",
      "src_rack": "clem",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 30081,
        "in_day_max_value": 144034,
        "in_hr_avg_value": 28748,
        "in_hr_max_value": 35196,
        "in_now_value": 26548,
        "out_day_avg_value": 37600,
        "out_day_max_value": 97285,
        "out_hr_avg_value": 37271,
        "out_hr_max_value": 40654,
        "out_now_value": 34876
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "100000000000",
      "src_rack": "mass",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 25692,
        "in_day_max_value": 182375,
        "in_hr_avg_value": 24850,
        "in_hr_max_value": 31010,
        "in_now_value": 22069,
        "out_day_avg_value": 21190,
        "out_day_max_value": 26150,
        "out_hr_avg_value": 20983,
        "out_hr_max_value": 24304,
        "out_now_value": 18623
      }
    }
  },
  {
    "metric": {
      "dst_rack": "dall",
      "max": "100000000000",
      "src_rack": "tacc",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 16517,
        "out_day_max_value": 19386,
        "out_hr_avg_value": 16380,
        "out_hr_max_value": 19386,
        "out_now_value": 14546
      }
    }
  },
  {
    "metric": {
      "dst_rack": "losa",
      "max": "10000000000",
      "src_rack": "toky",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 18347,
        "in_day_max_value": 70080,
        "in_hr_avg_value": 17655,
        "in_hr_max_value": 21467,
        "in_now_value": 15821,
        "out_day_avg_value": 20513,
        "out_day_max_value": 25679,
        "out_hr_avg_value": 20704,
        "out_hr_max_value": 24265,
        "out_now_value": 18590
      }
    }
  },
  {
    "metric": {
      "dst_rack": "losa",
      "max": "10000000000",
      "src_rack": "sri",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 37290,
        "in_day_max_value": 7197527,
        "in_hr_avg_value": 28963,
        "in_hr_max_value": 37480,
        "in_now_value": 25358,
        "out_day_avg_value": 10685214,
        "out_day_max_value": 9598074631,
        "out_hr_avg_value": 21655,
        "out_hr_max_value": 24433,
        "out_now_value": 19075
      }
    }
  },
  {
    "metric": {
      "dst_rack": "losa",
      "max": "100000000000",
      "src_rack": "hawi",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8228,
        "in_day_max_value": 9745,
        "in_hr_avg_value": 8392,
        "in_hr_max_value": 9745,
        "in_now_value": 7249,
        "out_day_avg_value": 16550,
        "out_day_max_value": 19494,
        "out_hr_avg_value": 16666,
        "out_hr_max_value": 19445,
        "out_now_value": 14570
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "10000000000",
      "src_rack": "gatech",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 38649,
        "in_day_max_value": 1401869,
        "in_hr_avg_value": 24913,
        "in_hr_max_value": 32538,
        "in_now_value": 21004,
        "out_day_avg_value": 34522,
        "out_day_max_value": 1382793,
        "out_hr_avg_value": 21148,
        "out_hr_max_value": 24399,
        "out_now_value": 19130
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "100000000000",
      "src_rack": "psc",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 64052,
        "in_day_max_value": 176437,
        "in_hr_avg_value": 62395,
        "in_hr_max_value": 69054,
        "in_now_value": 59885,
        "out_day_avg_value": 77399,
        "out_day_max_value": 177865,
        "out_hr_avg_value": 75981,
        "out_hr_max_value": 85321,
        "out_now_value": 77250
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "100000000000",
      "src_rack": "uky",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 0,
        "out_day_max_value": 0,
        "out_hr_avg_value": 0,
        "out_hr_max_value": 0,
        "out_now_value": 0
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "100000000000",
      "src_rack": "eduky",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 21554455,
        "in_day_max_value": 31025206443,
        "in_hr_avg_value": 8921,
        "in_hr_max_value": 12905,
        "in_now_value": 7647,
        "out_day_avg_value": 6496,
        "out_day_max_value": 9070017,
        "out_hr_avg_value": 197,
        "out_hr_max_value": 217,
        "out_now_value": 188
      }
    }
  },
  {
    "metric": {
      "dst_rack": "losa",
      "max": "100000000000",
      "src_rack": "ucsd",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 36335,
        "in_day_max_value": 5217731,
        "in_hr_avg_value": 28834,
        "in_hr_max_value": 37649,
        "in_now_value": 26643,
        "out_day_avg_value": 1034492,
        "out_day_max_value": 789044806,
        "out_hr_avg_value": 21828,
        "out_hr_max_value": 25090,
        "out_now_value": 24060
      }
    }
  },
  {
    "metric": {
      "dst_rack": "salt",
      "max": "100000000000",
      "src_rack": "kans",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 3115221,
        "in_day_max_value": 4408242414,
        "in_hr_avg_value": 38745,
        "in_hr_max_value": 50604,
        "in_now_value": 34268,
        "out_day_avg_value": 22578549,
        "out_day_max_value": 32465654826,
        "out_hr_avg_value": 32736,
        "out_hr_max_value": 38477,
        "out_now_value": 29178
      }
    }
  },
  {
    "metric": {
      "dst_rack": "newy",
      "max": "100000000000",
      "src_rack": "amst",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 28088,
        "in_day_max_value": 218590,
        "in_hr_avg_value": 27391,
        "in_hr_max_value": 34599,
        "in_now_value": 25381,
        "out_day_avg_value": 20245,
        "out_day_max_value": 24954,
        "out_hr_avg_value": 20474,
        "out_hr_max_value": 23273,
        "out_now_value": 17840
      }
    }
  },
  {
    "metric": {
      "dst_rack": "newy",
      "max": "10000000000",
      "src_rack": "brist",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 24873,
        "in_day_max_value": 115578,
        "in_hr_avg_value": 24060,
        "in_hr_max_value": 30338,
        "in_now_value": 23687,
        "out_day_avg_value": 20597,
        "out_day_max_value": 24622,
        "out_hr_avg_value": 20808,
        "out_hr_max_value": 23849,
        "out_now_value": 18353
      }
    }
  },
  {
    "metric": {
      "dst_rack": "kans",
      "max": "100000000000",
      "src_rack": "gpn",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 29186,
        "in_day_max_value": 158718,
        "in_hr_avg_value": 28141,
        "in_hr_max_value": 39687,
        "in_now_value": 23705,
        "out_day_avg_value": 21339,
        "out_day_max_value": 27112,
        "out_hr_avg_value": 20997,
        "out_hr_max_value": 24462,
        "out_now_value": 18678
      }
    }
  },
  {
    "metric": {
      "dst_rack": "seat",
      "max": "10000000000",
      "src_rack": "toky",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 18243,
        "in_day_max_value": 54291,
        "in_hr_avg_value": 17751,
        "in_hr_max_value": 22446,
        "in_now_value": 15551,
        "out_day_avg_value": 16924,
        "out_day_max_value": 21277,
        "out_hr_avg_value": 16319,
        "out_hr_max_value": 20083,
        "out_now_value": 14658
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "400000000000",
      "src_rack": "cern",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 9003,
        "in_day_max_value": 13150,
        "in_hr_avg_value": 8806,
        "in_hr_max_value": 10945,
        "in_now_value": 8109,
        "out_day_avg_value": 16981,
        "out_day_max_value": 21626,
        "out_hr_avg_value": 16953,
        "out_hr_max_value": 20435,
        "out_now_value": 15436
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "400000000000",
      "src_rack": "cern",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8776,
        "in_day_max_value": 23023,
        "in_hr_avg_value": 8696,
        "in_hr_max_value": 10356,
        "in_now_value": 10356,
        "out_day_avg_value": 16487,
        "out_day_max_value": 19474,
        "out_hr_avg_value": 17111,
        "out_hr_max_value": 19465,
        "out_now_value": 19465
      }
    }
  },
  {
    "metric": {
      "dst_rack": "newy",
      "max": "100000000000",
      "src_rack": "rutg",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 38951,
        "in_day_max_value": 18458275,
        "in_hr_avg_value": 25175,
        "in_hr_max_value": 34366,
        "in_now_value": 21975,
        "out_day_avg_value": 22701667,
        "out_day_max_value": 32658949806,
        "out_hr_avg_value": 22295,
        "out_hr_max_value": 66030,
        "out_now_value": 24399
      }
    }
  },
  {
    "metric": {
      "dst_rack": "seat",
      "max": "100000000000",
      "src_rack": "hawi",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 7596365,
        "in_day_max_value": 9550995193,
        "in_hr_avg_value": 27844,
        "in_hr_max_value": 37427,
        "in_now_value": 25310,
        "out_day_avg_value": 27349,
        "out_day_max_value": 9048718,
        "out_hr_avg_value": 20731,
        "out_hr_max_value": 23413,
        "out_now_value": 18143
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "400000000000",
      "src_rack": "cern",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 22782,
        "in_day_max_value": 88306,
        "in_hr_avg_value": 24760,
        "in_hr_max_value": 28747,
        "in_now_value": 24813,
        "out_day_avg_value": 16579,
        "out_day_max_value": 24551,
        "out_hr_avg_value": 16009,
        "out_hr_max_value": 19449,
        "out_now_value": 14550
      }
    }
  },
  {
    "metric": {
      "dst_rack": "atla",
      "max": "100000000000",
      "src_rack": "fiu",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 15903,
        "in_day_max_value": 92395,
        "in_hr_avg_value": 15258,
        "in_hr_max_value": 17494,
        "in_now_value": 13469,
        "out_day_avg_value": 16996,
        "out_day_max_value": 20276,
        "out_hr_avg_value": 16442,
        "out_hr_max_value": 19686,
        "out_now_value": 14769
      }
    }
  },
  {
    "metric": {
      "dst_rack": "newy",
      "max": "100000000000",
      "src_rack": "prin",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 25947,
        "in_day_max_value": 185676,
        "in_hr_avg_value": 25312,
        "in_hr_max_value": 30888,
        "in_now_value": 21668,
        "out_day_avg_value": 21429,
        "out_day_max_value": 26291,
        "out_hr_avg_value": 21926,
        "out_hr_max_value": 24551,
        "out_now_value": 24155
      }
    }
  },
  {
    "metric": {
      "dst_rack": "star",
      "max": "100000000000",
      "src_rack": "eduky",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 16764225,
        "in_day_max_value": 13147775603,
        "in_hr_avg_value": 6852,
        "in_hr_max_value": 9451,
        "in_now_value": 5671,
        "out_day_avg_value": 19661710,
        "out_day_max_value": 28282957340,
        "out_hr_avg_value": 118,
        "out_hr_max_value": 147,
        "out_now_value": 98
      }
    }
  },
  {
    "metric": {
      "dst_rack": "dall",
      "max": "100000000000",
      "src_rack": "kans",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 2692439,
        "in_day_max_value": 3786215358,
        "in_hr_avg_value": 59888,
        "in_hr_max_value": 78116,
        "in_now_value": 55351,
        "out_day_avg_value": 38667,
        "out_day_max_value": 8180333,
        "out_hr_avg_value": 32419,
        "out_hr_max_value": 39369,
        "out_now_value": 29096
      }
    }
  },
  {
    "metric": {
      "dst_rack": "kans",
      "max": "100000000000",
      "src_rack": "dall",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 30393,
        "in_day_max_value": 8212775,
        "in_hr_avg_value": 23989,
        "in_hr_max_value": 29286,
        "in_now_value": 21555,
        "out_day_avg_value": 2714802,
        "out_day_max_value": 3806156763,
        "out_hr_avg_value": 68597,
        "out_hr_max_value": 88318,
        "out_now_value": 65106
      }
    }
  },
  {
    "metric": {
      "dst_rack": "salt",
      "max": "100000000000",
      "src_rack": "seat",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 5404033,
        "in_day_max_value": 5296422250,
        "in_hr_avg_value": 38133,
        "in_hr_max_value": 46961,
        "in_now_value": 33660,
        "out_day_avg_value": 30222,
        "out_day_max_value": 12148685,
        "out_hr_avg_value": 21108,
        "out_hr_max_value": 24064,
        "out_now_value": 18639
      }
    }
  },
  {
    "metric": {
      "dst_rack": "ucsd",
      "max": "100000000000",
      "src_rack": "losa",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 886970,
        "in_day_max_value": 878241357,
        "in_hr_avg_value": 13908,
        "in_hr_max_value": 16652,
        "in_now_value": 15750,
        "out_day_avg_value": 42858,
        "out_day_max_value": 4985916,
        "out_hr_avg_value": 36970,
        "out_hr_max_value": 49604,
        "out_now_value": 29582
      }
    }
  },
  {
    "metric": {
      "dst_rack": "star",
      "max": "100000000000",
      "src_rack": "uky",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 0,
        "out_day_max_value": 0,
        "out_hr_avg_value": 0,
        "out_hr_max_value": 0,
        "out_now_value": 0
      }
    }
  },
  {
    "metric": {
      "dst_rack": "fiu",
      "max": "100000000000",
      "src_rack": "atla",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8391,
        "in_day_max_value": 10375,
        "in_hr_avg_value": 8537,
        "in_hr_max_value": 10028,
        "in_now_value": 9878,
        "out_day_avg_value": 24271,
        "out_day_max_value": 71690,
        "out_hr_avg_value": 23819,
        "out_hr_max_value": 29620,
        "out_now_value": 25587
      }
    }
  },
  {
    "metric": {
      "dst_rack": "max",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 116154,
        "in_day_max_value": 239013,
        "in_hr_avg_value": 115581,
        "in_hr_max_value": 144716,
        "in_now_value": 134762,
        "out_day_avg_value": 95642,
        "out_day_max_value": 239794,
        "out_hr_avg_value": 93573,
        "out_hr_max_value": 115474,
        "out_now_value": 86233
      }
    }
  },
  {
    "metric": {
      "dst_rack": "utah",
      "max": "400000000000",
      "src_rack": "ucsd",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8599,
        "in_day_max_value": 11041,
        "in_hr_avg_value": 8556,
        "in_hr_max_value": 10159,
        "in_now_value": 7632,
        "out_day_avg_value": 17023,
        "out_day_max_value": 21512,
        "out_hr_avg_value": 17113,
        "out_hr_max_value": 21427,
        "out_now_value": 15163
      }
    }
  },
  {
    "metric": {
      "dst_rack": "utah",
      "max": "100000000000",
      "src_rack": "gpn",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 16654,
        "out_day_max_value": 21774,
        "out_hr_avg_value": 17100,
        "out_hr_max_value": 19381,
        "out_now_value": 19353
      }
    }
  },
  {
    "metric": {
      "dst_rack": "atla",
      "max": "100000000000",
      "src_rack": "star",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 109227,
        "in_day_max_value": 16321392,
        "in_hr_avg_value": 2117580,
        "in_hr_max_value": 16321392,
        "in_now_value": 17342,
        "out_day_avg_value": 83962,
        "out_day_max_value": 6777408,
        "out_hr_avg_value": 669919,
        "out_hr_max_value": 6777408,
        "out_now_value": 56186
      }
    }
  },
  {
    "metric": {
      "dst_rack": "kans",
      "max": "100000000000",
      "src_rack": "star",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 29984,
        "in_day_max_value": 201274,
        "in_hr_avg_value": 28653,
        "in_hr_max_value": 39034,
        "in_now_value": 18495,
        "out_day_avg_value": 17075,
        "out_day_max_value": 24774,
        "out_hr_avg_value": 16841,
        "out_hr_max_value": 22489,
        "out_now_value": 15403
      }
    }
  },
  {
    "metric": {
      "dst_rack": "ncsa",
      "max": "100000000000",
      "src_rack": "star",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 434127,
        "in_day_max_value": 201999658,
        "in_hr_avg_value": 59908,
        "in_hr_max_value": 102765,
        "in_now_value": 22212,
        "out_day_avg_value": 56326,
        "out_day_max_value": 147560,
        "out_hr_avg_value": 71795,
        "out_hr_max_value": 102765,
        "out_now_value": 52479
      }
    }
  },
  {
    "metric": {
      "dst_rack": "seat",
      "max": "100000000000",
      "src_rack": "losa",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 12306,
        "in_day_max_value": 18688,
        "in_hr_avg_value": 12342,
        "in_hr_max_value": 14899,
        "in_now_value": 11310,
        "out_day_avg_value": 36909,
        "out_day_max_value": 185922,
        "out_hr_avg_value": 34937,
        "out_hr_max_value": 46509,
        "out_now_value": 28553
      }
    }
  },
  {
    "metric": {
      "dst_rack": "clem",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 29215,
        "in_day_max_value": 92280,
        "in_hr_avg_value": 29019,
        "in_hr_max_value": 35993,
        "in_now_value": 34010,
        "out_day_avg_value": 38653,
        "out_day_max_value": 173227,
        "out_hr_avg_value": 37395,
        "out_hr_max_value": 48401,
        "out_now_value": 35294
      }
    }
  },
  {
    "metric": {
      "dst_rack": "psc",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 70728,
        "in_day_max_value": 172510,
        "in_hr_avg_value": 70272,
        "in_hr_max_value": 88221,
        "in_now_value": 84863,
        "out_day_avg_value": 72609,
        "out_day_max_value": 209994,
        "out_hr_avg_value": 70611,
        "out_hr_max_value": 90090,
        "out_now_value": 60377
      }
    }
  },
  {
    "metric": {
      "dst_rack": "gpn",
      "max": "100000000000",
      "src_rack": "kans",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 12977,
        "in_day_max_value": 15811,
        "in_hr_avg_value": 12955,
        "in_hr_max_value": 14797,
        "in_now_value": 11553,
        "out_day_avg_value": 37572,
        "out_day_max_value": 124729,
        "out_hr_avg_value": 36013,
        "out_hr_max_value": 43330,
        "out_now_value": 37021
      }
    }
  },
  {
    "metric": {
      "dst_rack": "fiu",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 26152,
        "in_day_max_value": 1702508,
        "in_hr_avg_value": 12424,
        "in_hr_max_value": 15461,
        "in_now_value": 14417,
        "out_day_avg_value": 39498,
        "out_day_max_value": 1591719,
        "out_hr_avg_value": 26073,
        "out_hr_max_value": 34446,
        "out_now_value": 23004
      }
    }
  },
  {
    "metric": {
      "dst_rack": "amst",
      "max": "100000000000",
      "src_rack": "newy",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 11775,
        "in_day_max_value": 17287,
        "in_hr_avg_value": 11768,
        "in_hr_max_value": 14250,
        "in_now_value": 9063,
        "out_day_avg_value": 36498,
        "out_day_max_value": 165548,
        "out_hr_avg_value": 34793,
        "out_hr_max_value": 47366,
        "out_now_value": 28972
      }
    }
  },
  {
    "metric": {
      "dst_rack": "amst",
      "src_rack": "cern",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8531,
        "in_day_max_value": 13122,
        "in_hr_avg_value": 8545,
        "in_hr_max_value": 10342,
        "in_now_value": 7746,
        "out_day_avg_value": 17085,
        "out_day_max_value": 38018,
        "out_hr_avg_value": 16972,
        "out_hr_max_value": 20817,
        "out_now_value": 15533
      }
    }
  },
  {
    "metric": {
      "dst_rack": "indi",
      "max": "100000000000",
      "src_rack": "star",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 103244,
        "in_day_max_value": 196346,
        "in_hr_avg_value": 100211,
        "in_hr_max_value": 144775,
        "in_now_value": 60985,
        "out_day_avg_value": 100894,
        "out_day_max_value": 724082,
        "out_hr_avg_value": 96198,
        "out_hr_max_value": 123279,
        "out_now_value": 88354
      }
    }
  },
  {
    "metric": {
      "dst_rack": "kans",
      "max": "100000000000",
      "src_rack": "salt",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 23483568,
        "in_day_max_value": 33757346223,
        "in_hr_avg_value": 24103,
        "in_hr_max_value": 28606,
        "in_now_value": 24119,
        "out_day_avg_value": 3221405,
        "out_day_max_value": 4544946983,
        "out_hr_avg_value": 47010,
        "out_hr_max_value": 61408,
        "out_now_value": 42218
      }
    }
  },
  {
    "metric": {
      "dst_rack": "losa",
      "max": "100000000000",
      "src_rack": "seat",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 28897,
        "in_day_max_value": 262157,
        "in_hr_avg_value": 28252,
        "in_hr_max_value": 34767,
        "in_now_value": 25803,
        "out_day_avg_value": 20883,
        "out_day_max_value": 25193,
        "out_hr_avg_value": 21078,
        "out_hr_max_value": 24537,
        "out_now_value": 18318
      }
    }
  },
  {
    "metric": {
      "dst_rack": "mich",
      "max": "100000000000",
      "src_rack": "star",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 13160,
        "in_day_max_value": 16860,
        "in_hr_avg_value": 12945,
        "in_hr_max_value": 15985,
        "in_now_value": 10093,
        "out_day_avg_value": 34152,
        "out_day_max_value": 98124,
        "out_hr_avg_value": 32979,
        "out_hr_max_value": 43532,
        "out_now_value": 28509
      }
    }
  },
  {
    "metric": {
      "dst_rack": "prin",
      "max": "100000000000",
      "src_rack": "newy",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 13136,
        "in_day_max_value": 16986,
        "in_hr_avg_value": 12928,
        "in_hr_max_value": 15783,
        "in_now_value": 9698,
        "out_day_avg_value": 34220,
        "out_day_max_value": 143133,
        "out_hr_avg_value": 32956,
        "out_hr_max_value": 46993,
        "out_now_value": 27865
      }
    }
  },
  {
    "metric": {
      "dst_rack": "rutg",
      "max": "100000000000",
      "src_rack": "newy",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 12440993,
        "in_day_max_value": 14578129314,
        "in_hr_avg_value": 13147,
        "in_hr_max_value": 21139,
        "in_now_value": 9726,
        "out_day_avg_value": 39461,
        "out_day_max_value": 7141722,
        "out_hr_avg_value": 33774,
        "out_hr_max_value": 45431,
        "out_now_value": 30437
      }
    }
  },
  {
    "metric": {
      "dst_rack": "seat",
      "max": "100000000000",
      "src_rack": "salt",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 17335,
        "in_day_max_value": 5613988,
        "in_hr_avg_value": 12771,
        "in_hr_max_value": 14415,
        "in_now_value": 11384,
        "out_day_avg_value": 12992727,
        "out_day_max_value": 18171529035,
        "out_hr_avg_value": 45372,
        "out_hr_max_value": 58518,
        "out_now_value": 45002
      }
    }
  },
  {
    "metric": {
      "dst_rack": "star",
      "max": "100000000000",
      "src_rack": "indi",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 92099,
        "in_day_max_value": 249455,
        "in_hr_avg_value": 89402,
        "in_hr_max_value": 117427,
        "in_now_value": 84037,
        "out_day_avg_value": 110255,
        "out_day_max_value": 187527,
        "out_hr_avg_value": 107575,
        "out_hr_max_value": 113100,
        "out_now_value": 110657
      }
    }
  },
  {
    "metric": {
      "dst_rack": "utah",
      "max": "100000000000",
      "src_rack": "salt",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 39439,
        "in_day_max_value": 6838150,
        "in_hr_avg_value": 633651,
        "in_hr_max_value": 6838150,
        "in_now_value": 14214,
        "out_day_avg_value": 132993,
        "out_day_max_value": 13652447,
        "out_hr_avg_value": 2306537,
        "out_hr_max_value": 13652447,
        "out_now_value": 37470
      }
    }
  },
  {
    "metric": {
      "dst_rack": "wash",
      "max": "100000000000",
      "src_rack": "star",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 146952,
        "in_day_max_value": 587882,
        "in_hr_avg_value": 149675,
        "in_hr_max_value": 194138,
        "in_now_value": 88954,
        "out_day_avg_value": 131322,
        "out_day_max_value": 354520,
        "out_hr_avg_value": 126152,
        "out_hr_max_value": 173182,
        "out_now_value": 107865
      }
    }
  },
  {
    "metric": {
      "dst_rack": "mass",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 12939,
        "in_day_max_value": 17089,
        "in_hr_avg_value": 12915,
        "in_hr_max_value": 15598,
        "in_now_value": 12279,
        "out_day_avg_value": 34006,
        "out_day_max_value": 167873,
        "out_hr_avg_value": 33065,
        "out_hr_max_value": 42404,
        "out_now_value": 30930
      }
    }
  },
  {
    "metric": {
      "dst_rack": "tacc",
      "max": "100000000000",
      "src_rack": "dall",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 16749,
        "out_day_max_value": 19386,
        "out_hr_avg_value": 16536,
        "out_hr_max_value": 19386,
        "out_now_value": 14518
      }
    }
  },
  {
    "metric": {
      "dst_rack": "amst",
      "max": "10000000000",
      "src_rack": "brist",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8526,
        "in_day_max_value": 10753,
        "in_hr_avg_value": 8508,
        "in_hr_max_value": 10258,
        "in_now_value": 10094,
        "out_day_avg_value": 16940,
        "out_day_max_value": 21534,
        "out_hr_avg_value": 16693,
        "out_hr_max_value": 20198,
        "out_now_value": 20196
      }
    }
  },
  {
    "metric": {
      "dst_rack": "hawi",
      "max": "100000000000",
      "src_rack": "seat",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 15165,
        "in_day_max_value": 1787865,
        "in_hr_avg_value": 12558,
        "in_hr_max_value": 14029,
        "in_now_value": 13432,
        "out_day_avg_value": 19846661,
        "out_day_max_value": 28064667267,
        "out_hr_avg_value": 35265,
        "out_hr_max_value": 45856,
        "out_now_value": 33330
      }
    }
  },
  {
    "metric": {
      "dst_rack": "hawi",
      "max": "100000000000",
      "src_rack": "losa",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8402,
        "in_day_max_value": 9868,
        "in_hr_avg_value": 8425,
        "in_hr_max_value": 9843,
        "in_now_value": 9785,
        "out_day_avg_value": 16409,
        "out_day_max_value": 21700,
        "out_hr_avg_value": 16433,
        "out_hr_max_value": 21646,
        "out_now_value": 16860
      }
    }
  },
  {
    "metric": {
      "dst_rack": "ncsa",
      "max": "100000000000",
      "src_rack": "star",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8327,
        "in_day_max_value": 9797,
        "in_hr_avg_value": 8187,
        "in_hr_max_value": 9789,
        "in_now_value": 7317,
        "out_day_avg_value": 23880,
        "out_day_max_value": 394314,
        "out_hr_avg_value": 36175,
        "out_hr_max_value": 63922,
        "out_now_value": 20933
      }
    }
  },
  {
    "metric": {
      "dst_rack": "star",
      "max": "100000000000",
      "src_rack": "kans",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8523,
        "in_day_max_value": 16894,
        "in_hr_avg_value": 8698,
        "in_hr_max_value": 10331,
        "in_now_value": 7745,
        "out_day_avg_value": 38479,
        "out_day_max_value": 138318,
        "out_hr_avg_value": 37085,
        "out_hr_max_value": 46906,
        "out_now_value": 32439
      }
    }
  },
  {
    "metric": {
      "dst_rack": "star",
      "max": "100000000000",
      "src_rack": "atla",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 75787,
        "in_day_max_value": 8199967,
        "in_hr_avg_value": 667282,
        "in_hr_max_value": 8199967,
        "in_now_value": 46109,
        "out_day_avg_value": 125294,
        "out_day_max_value": 13640141,
        "out_hr_avg_value": 2313232,
        "out_hr_max_value": 13640141,
        "out_now_value": 27930
      }
    }
  },
  {
    "metric": {
      "dst_rack": "star",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 123322,
        "in_day_max_value": 502969,
        "in_hr_avg_value": 120576,
        "in_hr_max_value": 158943,
        "in_now_value": 134920,
        "out_day_avg_value": 153273,
        "out_day_max_value": 574304,
        "out_hr_avg_value": 156090,
        "out_hr_max_value": 212804,
        "out_now_value": 134878
      }
    }
  },
  {
    "metric": {
      "dst_rack": "star",
      "max": "100000000000",
      "src_rack": "mich",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 25705,
        "in_day_max_value": 137404,
        "in_hr_avg_value": 25086,
        "in_hr_max_value": 31223,
        "in_now_value": 21253,
        "out_day_avg_value": 21226,
        "out_day_max_value": 26018,
        "out_hr_avg_value": 20906,
        "out_hr_max_value": 24504,
        "out_now_value": 18915
      }
    }
  },
  {
    "metric": {
      "dst_rack": "toky",
      "max": "100000000000",
      "src_rack": "seat",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8521,
        "in_day_max_value": 10830,
        "in_hr_avg_value": 8287,
        "in_hr_max_value": 10161,
        "in_now_value": 7352,
        "out_day_avg_value": 26659,
        "out_day_max_value": 80799,
        "out_hr_avg_value": 26152,
        "out_hr_max_value": 32490,
        "out_now_value": 28738
      }
    }
  },
  {
    "metric": {
      "dst_rack": "toky",
      "max": "100000000000",
      "src_rack": "losa",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 11849,
        "in_day_max_value": 16399,
        "in_hr_avg_value": 12202,
        "in_hr_max_value": 14302,
        "in_now_value": 13450,
        "out_day_avg_value": 26884,
        "out_day_max_value": 102557,
        "out_hr_avg_value": 26094,
        "out_hr_max_value": 35668,
        "out_now_value": 24342
      }
    }
  },
  {
    "metric": {
      "dst_rack": "gatech",
      "max": "100000000000",
      "src_rack": "wash",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 26100,
        "in_day_max_value": 1639752,
        "in_hr_avg_value": 12848,
        "in_hr_max_value": 15966,
        "in_now_value": 12341,
        "out_day_avg_value": 47211,
        "out_day_max_value": 1657717,
        "out_hr_avg_value": 33300,
        "out_hr_max_value": 45052,
        "out_now_value": 31003
      }
    }
  },
  {
    "metric": {
      "dst_rack": "renc",
      "max": "100000000000",
      "src_rack": "lbnl",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 54,
        "in_day_max_value": 24067,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 11,
        "out_day_max_value": 69,
        "out_hr_avg_value": 2,
        "out_hr_max_value": 29,
        "out_now_value": 0
      }
    }
  },
  {
    "metric": {
      "dst_rack": "renc",
      "max": "100000000000",
      "src_rack": "uky",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 0,
        "in_day_max_value": 0,
        "in_hr_avg_value": 0,
        "in_hr_max_value": 0,
        "in_now_value": 0,
        "out_day_avg_value": 0,
        "out_day_max_value": 0,
        "out_hr_avg_value": 0,
        "out_hr_max_value": 0,
        "out_now_value": 0
      }
    }
  },
  {
    "metric": {
      "dst_rack": "brist",
      "max": "100000000000",
      "src_rack": "amst",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 8460,
        "in_day_max_value": 10931,
        "in_hr_avg_value": 8569,
        "in_hr_max_value": 10060,
        "in_now_value": 7519,
        "out_day_avg_value": 16961,
        "out_day_max_value": 22077,
        "out_hr_avg_value": 16932,
        "out_hr_max_value": 20333,
        "out_now_value": 15231
      }
    }
  },
  {
    "metric": {
      "dst_rack": "brist",
      "max": "100000000000",
      "src_rack": "newy",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 12349,
        "in_day_max_value": 18257,
        "in_hr_avg_value": 12501,
        "in_hr_max_value": 14986,
        "in_now_value": 9387,
        "out_day_avg_value": 33339,
        "out_day_max_value": 144436,
        "out_hr_avg_value": 32753,
        "out_hr_max_value": 42179,
        "out_now_value": 29666
      }
    }
  },
  {
    "metric": {
      "dst_rack": "sri",
      "max": "100000000000",
      "src_rack": "losa",
      "unit": "bits/second",
      "values": {
        "in_day_avg_value": 6840269,
        "in_day_max_value": 6753226961,
        "in_hr_avg_value": 13220,
        "in_hr_max_value": 15903,
        "in_now_value": 14940,
        "out_day_avg_value": 48934,
        "out_day_max_value": 8480300,
        "out_hr_avg_value": 35964,
        "out_hr_max_value": 50917,
        "out_now_value": 31515
      }
    }
  }
]

export function getLinksData() {
  return links;
}

