// import React, { useMemo, useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogActions,
//   Typography,
//   useTheme,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import { getImageUrl } from "../utils/airlineUtils";
// import { Link } from "react-router-dom";

// /**
//  * WheelSpinner – same design, fixed labels:
//  * - Labels tilt with their slice (like your reference)
//  * - Long text wraps to multiple lines and stays inside the wedge
//  * - Popup has Try Again + Close
//  * - Pure JS (no TypeScript types), clean JSX
//  */
// export default function WheelSpinner() {
//   const theme = useTheme();
//   const greenChipsPrice = useSelector((state) => state.booking.greenChipsPrice);
//   console.log("-ggg", greenChipsPrice)
//   const PRIZES = useMemo(
//     () => [
//       { label: "5% off on next booking", color: "#F44336" }, // red
//       { label: "50 Green Chips", color: "#1E88E5" }, // blue
//       { label: "Free Coffee Coupon", color: "#43A047" }, // green
//       { label: "1 Free Spin", color: "#F9A825" }, // amber
//       { label: "Better Luck Next Time", color: "#8E24AA" }, // purple
//       { label: "Bumper Prize (1 Night at a 4-Star Hotel)", color: "#FB8C00" }, // orange
//     ],
//     []
//   );

//   const SEG = 360 / PRIZES.length;

//   // Animation
//   const [rotation, setRotation] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [spinning, setSpinning] = useState(false);

//   // Result + popup
//   const [winnerIndex, setWinnerIndex] = useState(null);
//   const [open, setOpen] = useState(false);

//   const durationMs = 5000;
//   const easing = "cubic-bezier(.17,.67,.16,1)";

//   // SVG geometry
//   const size = 520;
//   const cx = size / 2;
//   const cy = size / 2;
//   const rOuter = cx - 6;

//   const polarToCartesian = (cx, cy, r, angleDeg) => {
//     const a = ((angleDeg - 90) * Math.PI) / 180; // 0° at top
//     return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
//   };

//   const describeSector = (cx, cy, r, startAngle, endAngle) => {
//     const start = polarToCartesian(cx, cy, r, endAngle);
//     const end = polarToCartesian(cx, cy, r, startAngle);
//     const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
//     return [
//       `M ${cx} ${cy}`,
//       `L ${end.x} ${end.y}`,
//       `A ${r} ${r} 0 ${largeArc} 0 ${start.x} ${start.y}`,
//       "Z",
//     ].join(" ");
//   };

//   const prizeTextFill = (hex) => theme.palette.getContrastText(hex);

//   const handleTransitionEnd = () => {
//     setIsAnimating(false);
//     setSpinning(false);
//     setOpen(true);
//   };

//   //   this code basically for using better luck next if you want remove 

//   // Always land on "Better Luck Next Time"
//   const BLNT_INDEX = useMemo(() => {
//     const i = PRIZES.findIndex(
//       (p) => /better luck next time/i.test(p.label)
//     );
//     return i === -1 ? 0 : i; // fallback to 0 if not found
//   }, [PRIZES]);

//   const spin = (avoidSame = false) => {
//     // commet code jo hai randomly k liye hai issko commen out kar let idx = BLNT_INDEX; isko hata dena hai bas aur isko upar se hata dena 

//     // if (spinning) return;

//     // const prevIdx = winnerIndex ?? -1;
//     // let idx = Math.floor(Math.random() * PRIZES.length);
//     // if (avoidSame && PRIZES.length > 1) {
//     //   while (idx === prevIdx) idx = Math.floor(Math.random() * PRIZES.length);
//     // }
//     // Always choose "Better Luck Next Time"
//     let idx = BLNT_INDEX;

//     // Center of slice -> arrow (top)
//     const center = idx * SEG + SEG / 2;

//     // slight randomness so it doesn’t stop dead-center
//     const margin = Math.min(18, SEG * 0.15);
//     const jitterRange = SEG - margin * 2;
//     const jitter = Math.random() * jitterRange - jitterRange / 2;

//     const base = ((rotation % 360) + 360) % 360;
//     const goalNorm = (360 - (center + jitter)) % 360;
//     const extraSpins = 4 + Math.floor(Math.random() * 3); // 4..6

//     setWinnerIndex(idx);
//     setIsAnimating(true);
//     setSpinning(true);
//     setRotation((prev) => prev + ((goalNorm - base + 360) % 360) + extraSpins * 360);
//   };

//   // --- labels that tilt with slice, wrap, and stay inside the wedge ---
//   const slices = PRIZES.map((p, i) => {
//     const start = i * SEG;
//     const end = start + SEG;
//     const path = describeSector(cx, cy, rOuter, start, end);
//     const middle = start + SEG / 2;

//     // typography
//     let fontSize = Math.max(12, Math.min(16, size * 0.032));
//     const lineHeight = 1.12;
//     const maxLines = 4;

//     // place text near the rim; move inward if many lines
//     const radiusForLines = (n) => (n >= 3 ? rOuter * 0.60 : rOuter * 0.68);

//     // chord width at that radius (horizontal line length inside wedge)
//     const chordWidth = (r) => {
//       const theta = (SEG * Math.PI) / 180;
//       return 2 * r * Math.sin(theta / 2) * 0.9; // 10% margins
//     };

//     // simple word-wrap using estimated glyph width
//     const wrap = (label, fs, r) => {
//       const maxPx = chordWidth(r);
//       const avgChar = fs * 0.56;
//       const maxChars = Math.max(6, Math.floor(maxPx / avgChar));
//       const words = label.split(/\s+/);
//       const lines = [];
//       let line = "";
//       for (const w of words) {
//         const cand = line ? line + " " + w : w;
//         if (cand.length <= maxChars) line = cand;
//         else {
//           if (line) lines.push(line);
//           line = w;
//         }
//       }
//       if (line) lines.push(line);
//       return lines;
//     };

//     let lines = wrap(p.label, fontSize, radiusForLines(1));
//     let tries = 0;
//     while (lines.length > maxLines && tries < 8) {
//       fontSize = Math.max(10, fontSize - 1);
//       lines = wrap(p.label, fontSize, radiusForLines(lines.length));
//       tries++;
//     }
//     if (lines.length > maxLines) {
//       const keep = lines.slice(0, maxLines - 1);
//       const tail = lines.slice(maxLines - 1).join(" ");
//       lines = [...keep, tail];
//     }

//     const rText = radiusForLines(lines.length);
//     const totalH = (lines.length - 3) * fontSize * lineHeight;
//     const startY = cy - rText - totalH; // bottom-align block near rim
//     const textFill = prizeTextFill(p.color);

//     return (
//       <g key={i}>
//         <path d={path} fill={p.color} />

//         {/* rotate to slice; keep text tilted (no counter-rotation) */}
//         <g transform={`rotate(${middle}, ${cx}, ${cy})`}>
//           <text
//             x={cx}
//             y={startY}
//             textAnchor="middle"
//             dominantBaseline="alphabetic"
//             style={{
//               fontSize,
//               fontWeight: 700,
//               fill: textFill,
//               userSelect: "none",
//               fontFamily: theme.typography.fontFamily,
//             }}
//           >
//             {lines.map((ln, li) => (
//               <tspan key={li} x={cx} dy={li === 0 ? 0 : fontSize * lineHeight}>
//                 {ln}
//               </tspan>
//             ))}
//           </text>
//         </g>
//       </g>
//     );
//   });

//   const winnerLabel =
//     typeof winnerIndex === "number" ? PRIZES[winnerIndex].label : "";
//   const handleTryAgain = () => {
//     if (spinning) return;        // guard
//     setOpen(false);              // close the popup first
//     setTimeout(() => spin(true), 0); // start a fresh spin (avoid same result)
//   };
//   const handleSpin = () => {
//     spin(false)
//   }
//   return (
//     <>
//     <div
//   style={{
//     background: "#fff",
//     borderBottom: "1px solid #e5e7eb",
//     boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
//     height: "56px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 16px",
//     fontSize: "14px",
//     fontWeight: 500,
//   }}
// >
//   <div style={{ display: "flex", alignItems: "center" }}>
//     <Link to="/">
//       <img
//         style={{ width: "100px", height: "auto", display: "block" }}
//         src={getImageUrl("logo.png")}
//         alt="Logo"
//       />
//     </Link>
//   </div>
//   <div
//   style={{
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     fontSize: "15px",
//     fontWeight: 500,
//     color: "#111827", // darker text for label
//   }}
// >
//   <span>Coins:</span>
//   <span
//     style={{
//       background: "linear-gradient(90deg,#f59e0b,#f97316)", // nice orange gradient
//       color: "#fff",
//       fontWeight: 600,
//       padding: "2px 10px",
//       borderRadius: "20px",
//       fontSize: "14px",
//       boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
//     }}
//   >
//     ₹{greenChipsPrice || 0.00}
//   </span>
// </div>

// </div>


//     <Box sx={{
//       p: { xs: 2, sm: 3 },
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "100vh",  // or "100%" if parent has fixed height
//       width: "100%"
//     }}>
//       <Box
//         sx={{
//           position: "relative",
//           width: { xs: "92vw", sm: 480, md: 520 },
//           aspectRatio: "1 / 1",
//           maxWidth: 560,
//           filter: "drop-shadow(0 10px 18px rgba(0,0,0,.22))",
//         }}
//       >
//         {/* Arrow (top, fixed) */}
//         <Box
//           sx={{
//             position: "absolute",
//             top: -6,
//             left: "50%",
//             transform: "translateX(-50%)",
//             width: 0,
//             height: 0,
//             zIndex: 3,
//             borderLeft: "14px solid transparent",
//             borderRight: "14px solid transparent",
//             borderBottom: `22px solid ${theme.palette.error.main}`,
//           }}
//         />

//         {/* Wheel SVG */}
//         <Box
//           component="svg"
//           viewBox={`0 0 ${size} ${size}`}
//           onTransitionEnd={handleTransitionEnd}
//           sx={{
//             position: "absolute",
//             inset: 0,
//             transform: `rotate(${rotation}deg)`,
//             transition: isAnimating ? `transform ${durationMs}ms ${easing}` : "none",
//             borderRadius: "50%",
//             background: theme.palette.background.paper,
//           }}
//         >
//           {/* subtle ring */}
//           <circle cx={cx} cy={cy} r={rOuter} fill={theme.palette.grey[900]} opacity={0.06} />
//           {slices}
//           {/* hub */}
//           <circle cx={cx} cy={cy} r={rOuter * 0.28} fill={theme.palette.background.paper} />
//         </Box>

//         {/* Center button */}
//         <Box
//           sx={{
//             position: "absolute",
//             inset: 0,
//             display: "grid",
//             placeItems: "center",
//             zIndex: 4,
//             pointerEvents: "none",
//           }}
//         >
//           <Button
//             variant="contained"
//             size="large"
//             onClick={handleSpin}
//             disabled={spinning}
//             sx={{
//               pointerEvents: "auto",
//               width: 120,
//               height: 120,
//               borderRadius: "999px",
//               fontWeight: 800,
//               letterSpacing: 1,
//               boxShadow: 6,
//             }}
//           >
//             {spinning ? "Spinning…" : "SPIN"}
//           </Button>
//         </Box>
//       </Box>

//       {/* Result popup */}
//       <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth >
//         <DialogTitle>
//           <Typography variant="h6" fontWeight={700} >
//             We have a winner!
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="h4" fontWeight={700} sx={{ textAlign: "center", py: 1 }}>
//             {spinning ? "Spinning…" : winnerLabel}
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ p: 2, gap: 1, flexWrap: "wrap" }}>
//           <Button variant="outlined" onClick={() => setOpen(false)} disabled={spinning}>
//             Close
//           </Button>
//           <Box sx={{ flex: 1 }} />
//           <Button
//             variant="contained"
//             onClick={handleTryAgain}
//             disabled={spinning}
//           >
//             {spinning ? "Please wait" : "Try Again"}
//           </Button>

//         </DialogActions>
//       </Dialog>
//     </Box>
//         </>
//   );
// }


import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getImageUrl } from "../utils/airlineUtils";
import { Link } from "react-router-dom";
import axios from "axios";
import { galileoApi } from "../Api/apiService";
import { setCommonChips, setCommonWallet } from "../redux/actions/bookingActions";
export default function WheelSpinner() {
  const theme = useTheme();
  const greenChipsPrice = useSelector((state) => state.booking.greenChipsPrice);
  //  const user = useSelector((state) => state.auth.user);
  //  const token = user?.token;
  //  console.log(user,"ishwq")
  const PRIZES = useMemo(
    () => [
      { label: "5% off on next booking", color: "#F44336" }, // red
      { label: "50 Green Chips", color: "#1E88E5" }, // blue
      { label: "Free Coffee Coupon", color: "#43A047" }, // green
      { label: "1 Free Spin", color: "#F9A825" }, // amber
      { label: "Better Luck Next Time", color: "#8E24AA" }, // purple
      { label: "Bumper Prize (1 Night at a 4-Star Hotel)", color: "#FB8C00" }, // orange
    ],
    []
  );

  const SEG = 360 / PRIZES.length;

  // Animation
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [spinning, setSpinning] = useState(false);

  // Result + popup
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [open, setOpen] = useState(false);
  // ***************
  const [winnerValue, setWinnerValue] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const token = user?.token; // correct path
  const dispatch = useDispatch();
  console.log("Winner Prize:", winnerValue);
  const durationMs = 5000;
  const easing = "cubic-bezier(.17,.67,.16,1)";

  // SVG geometry
  const size = 520;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = cx - 6;

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const a = ((angleDeg - 90) * Math.PI) / 180; // 0° at top
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const describeSector = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return [
      `M ${cx} ${cy}`,
      `L ${end.x} ${end.y}`,
      `A ${r} ${r} 0 ${largeArc} 0 ${start.x} ${start.y}`,
      "Z",
    ].join(" ");
  };

  const prizeTextFill = (hex) => theme.palette.getContrastText(hex);

  const handleTransitionEnd = () => {
    setIsAnimating(false);
    setSpinning(false);
    setOpen(true);
    if (winnerIndex !== null) {
      const prize = PRIZES[winnerIndex].label;
      setWinnerValue(prize);   // ✅ store in state

    }
  };

  //   this code basically for using better luck next if you want remove 

  // Always land on "Better Luck Next Time"
  const BLNT_INDEX = useMemo(() => {
    const i = PRIZES.findIndex(
      (p) => /better luck next time/i.test(p.label)
    );
    return i === -1 ? 0 : i; // fallback to 0 if not found
  }, [PRIZES]);

  const spin = (avoidSame = false) => {
    // commet code jo hai randomly k liye hai issko commen out kar let idx = BLNT_INDEX; isko hata dena hai bas aur isko upar se hata dena 

    // if (spinning) return;

    // const prevIdx = winnerIndex ?? -1;
    // let idx = Math.floor(Math.random() * PRIZES.length);
    // if (avoidSame && PRIZES.length > 1) {
    //   while (idx === prevIdx) idx = Math.floor(Math.random() * PRIZES.length);
    // }
    // Always choose "Better Luck Next Time"
    let idx = BLNT_INDEX;

    // Center of slice -> arrow (top)
    const center = idx * SEG + SEG / 2;

    // slight randomness so it doesn’t stop dead-center
    const margin = Math.min(18, SEG * 0.15);
    const jitterRange = SEG - margin * 2;
    const jitter = Math.random() * jitterRange - jitterRange / 2;

    const base = ((rotation % 360) + 360) % 360;
    const goalNorm = (360 - (center + jitter)) % 360;
    const extraSpins = 4 + Math.floor(Math.random() * 3); // 4..6

    setWinnerIndex(idx);
    setIsAnimating(true);
    setSpinning(true);
    setRotation((prev) => prev + ((goalNorm - base + 360) % 360) + extraSpins * 360);
  };

  // --- labels that tilt with slice, wrap, and stay inside the wedge ---
  const slices = PRIZES.map((p, i) => {
    const start = i * SEG;
    const end = start + SEG;
    const path = describeSector(cx, cy, rOuter, start, end);
    const middle = start + SEG / 2;

    // typography
    let fontSize = Math.max(12, Math.min(16, size * 0.032));
    const lineHeight = 1.12;
    const maxLines = 4;

    // place text near the rim; move inward if many lines
    const radiusForLines = (n) => (n >= 3 ? rOuter * 0.60 : rOuter * 0.68);

    // chord width at that radius (horizontal line length inside wedge)
    const chordWidth = (r) => {
      const theta = (SEG * Math.PI) / 180;
      return 2 * r * Math.sin(theta / 2) * 0.9; // 10% margins
    };

    // simple word-wrap using estimated glyph width
    const wrap = (label, fs, r) => {
      const maxPx = chordWidth(r);
      const avgChar = fs * 0.56;
      const maxChars = Math.max(6, Math.floor(maxPx / avgChar));
      const words = label.split(/\s+/);
      const lines = [];
      let line = "";
      for (const w of words) {
        const cand = line ? line + " " + w : w;
        if (cand.length <= maxChars) line = cand;
        else {
          if (line) lines.push(line);
          line = w;
        }
      }
      if (line) lines.push(line);
      return lines;
    };

    let lines = wrap(p.label, fontSize, radiusForLines(1));
    let tries = 0;
    while (lines.length > maxLines && tries < 8) {
      fontSize = Math.max(10, fontSize - 1);
      lines = wrap(p.label, fontSize, radiusForLines(lines.length));
      tries++;
    }
    if (lines.length > maxLines) {
      const keep = lines.slice(0, maxLines - 1);
      const tail = lines.slice(maxLines - 1).join(" ");
      lines = [...keep, tail];
    }

    const rText = radiusForLines(lines.length);
    const totalH = (lines.length - 3) * fontSize * lineHeight;
    const startY = cy - rText - totalH; // bottom-align block near rim
    const textFill = prizeTextFill(p.color);

    return (
      <g key={i}>
        <path d={path} fill={p.color} />

        {/* rotate to slice; keep text tilted (no counter-rotation) */}
        <g transform={`rotate(${middle}, ${cx}, ${cy})`}>
          <text
            x={cx}
            y={startY}
            textAnchor="middle"
            dominantBaseline="alphabetic"
            style={{
              fontSize,
              fontWeight: 700,
              fill: textFill,
              userSelect: "none",
              fontFamily: theme.typography.fontFamily,
            }}
          >
            {lines.map((ln, li) => (
              <tspan key={li} x={cx} dy={li === 0 ? 0 : fontSize * lineHeight}>
                {ln}
              </tspan>
            ))}
          </text>
        </g>
      </g>
    );
  });

  const winnerLabel =
    typeof winnerIndex === "number" ? PRIZES[winnerIndex].label : "";
  //  const handleSpinAction = (retry = false) => {
  //   if (spinning) return; // guard

  //   if (retry) {
  //     setOpen(false); // close popup first
  //     setTimeout(() => spin(true), 0); // fresh spin
  //   } else {
  //     spin(false); // normal spin
  //   }
  // };







  const handleSpinAction = async (retry = false) => {
    if (!token) {
      console.error("Token missing, cannot spin!");
      return;
    }

    const reqbody = { 
      amount: 50, 
      winnerValue: winnerValue
     }

    try {
      const response = await galileoApi("/Agent-spin-coins",reqbody, token);
      console.log("djjkdkkjd + ",response)
      if (response?.status === 200) {
        // ✅ update Redux balance
        dispatch(setCommonChips(response.remaining_coins));
      }

      if (retry) {
        setOpen(false);
        setTimeout(() => spin(true), 0);
      } else {
        spin(false);
      }
    } catch (err) {
      console.error("Spin API failed:", err);
    }
  };


  return (
    <>
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        {/* <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/">
            <img
              style={{ width: "100px", height: "auto", display: "block" }}
              src={getImageUrl("logo.png")}
              alt="Logo"
            />
          </Link>
        </div> */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "15px",
            fontWeight: 500,
            color: "#111827", // darker text for label
          }}
        >
          <span>Commission:</span>
          <span
            style={{
              background: "linear-gradient(90deg,#f59e0b,#f97316)", // nice orange gradient
              color: "#fff",
              fontWeight: 600,
              padding: "2px 10px",
              borderRadius: "20px",
              fontSize: "14px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
            }}
          >
            ₹{greenChipsPrice || 0.00}
          </span>
        </div>

      </div>


      <Box sx={{
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",  // or "100%" if parent has fixed height
        width: "100%"
      }}>
        <Box
          sx={{
            position: "relative",
            width: { xs: "92vw", sm: 480, md: 520 },
            aspectRatio: "1 / 1",
            maxWidth: 560,
            filter: "drop-shadow(0 10px 18px rgba(0,0,0,.22))",
          }}
        >
          {/* Arrow (top, fixed) */}
          <Box
            sx={{
              position: "absolute",
              top: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              zIndex: 3,
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderBottom: `22px solid ${theme.palette.error.main}`,
            }}
          />

          {/* Wheel SVG */}
          <Box
            component="svg"
            viewBox={`0 0 ${size} ${size}`}
            onTransitionEnd={handleTransitionEnd}
            sx={{
              position: "absolute",
              inset: 0,
              transform: `rotate(${rotation}deg)`,
              transition: isAnimating ? `transform ${durationMs}ms ${easing}` : "none",
              borderRadius: "50%",
              background: theme.palette.background.paper,
            }}
          >
            {/* subtle ring */}
            <circle cx={cx} cy={cy} r={rOuter} fill={theme.palette.grey[900]} opacity={0.06} />
            {slices}
            {/* hub */}
            <circle cx={cx} cy={cy} r={rOuter * 0.28} fill={theme.palette.background.paper} />
          </Box>

          {/* Center button */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => handleSpinAction(false)}
              disabled={greenChipsPrice < 50 || spinning}
              sx={{
                pointerEvents: "auto",
                width: 120,
                height: 120,
                borderRadius: "999px",
                fontWeight: 800,
                letterSpacing: 1,
                boxShadow: 6,
              }}
            >
              {spinning ? "Spinning…" : "SPIN"}
            </Button>
          </Box>
        </Box>

        {/* Result popup */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth >
          <DialogTitle>
            <Typography variant="h6" fontWeight={700} >
              We have a winner!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h4" fontWeight={700} sx={{ textAlign: "center", py: 1 }}>
              {spinning ? "Spinning…" : winnerLabel}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1, flexWrap: "wrap" }}>
            <Button variant="outlined" onClick={() => setOpen(false)} disabled={spinning}>
              Close
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button
              variant="contained"

              onClick={() => handleSpinAction(true)}
              disabled={greenChipsPrice < 50 || spinning}
            >
              {spinning ? "Please wait" : "Try Again"}
            </Button>

          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
