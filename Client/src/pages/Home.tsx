// import React from 'react';
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import {
  AppBar,
  CardContent,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import BottomNav from "../components/Header";
import Terms from "../components/Terms";

const games = [
  {
    name: "Gold6",
    time: "00:00:34",
    url: "https://cardgames.io/",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Tunella.jpg/640px-Tunella.jpg",
  },
  {
    name: "Lucky5",
    time: "00:04:35",
    url: "https://snake.io/",
    image:
      "https://upload.wikimedia.org/wikipedia/en/a/a4/Snakeio_app_icon.png",
  },
  {
    name: "Chess",
    time: "00:04:35",
    url: "https://www.chess.com/",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/ChessSet.jpg/640px-ChessSet.jpg",
  },
  {
    name: "Bloxd",
    time: "00:09:35",
    url: "https://bloxd.io/",
    image:
      "https://rocketgames.imgix.net/uploads/games/bloxdhop-io/bloxdhop-io.jpg?auto=format,compress,enhance&w=314&dpr=1",
  },
  {
    name: "Lucky Dice",
    time: "00:04:36",
    url: "https://ludoking.com/play/",
    image:
      "https://m.media-amazon.com/images/I/61diUFCa8vL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    name: "skribble",
    time: "00:09:36",
    url: "https://example.com/game/cash5",
    image:
      "https://imgmedia.lbb.in/media/2020/05/5eb9149cdda0dc33a2fde6bc_1589187740390.jpg",
  },
  {
    name: "Smash Kart",
    time: "00:04:05",
    url: "https://example.com/game/super3-digit",
    image:
      "https://yt3.googleusercontent.com/f4e3X0TDQ6edrwk29w6pBgxLdTnNUvZdBkDGDO0zqlWXY6NGVjdDvlTKhyg4apwjykBu-hSGuw=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "T T Races",
    time: "00:04:35",
    url: "https://funrace.io/",
    image:
      "https://cdn6.aptoide.com/imgs/e/4/b/e4b4e4964483ed2309bf56fb9a81ec1d_icon.png",
  },
  {
    name: "Australian Airship",
    time: "00:04:35",
    url: "https://example.com/game/australian-airship",
    image:
      "https://play-lh.googleusercontent.com/9NpK1nTL4vRr-u7ZxhWvFFTB3OGK4z7-fXMKXM6jPHCo3sOBtDvdRC8426IKDjmXew",
  },
];

function App() {
  // const navigate = useNavigate(); // Initialize useNavigate

  const handleCardClick = (url: string) => {
    window.open(url, "_blank"); // Opens the URL in a new tab
  };

  return (
    <div>
      {/* Top Navigation */}
      <Terms />
      <AppBar position="static" sx={{ backgroundColor: "#4e44ce" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          ></IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Victory Online
          </Typography>
          <IconButton color="inherit">
            <SupportAgentIcon />
            <Typography variant="body2" style={{ marginLeft: "5px" }}>
              Customer Service
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Banner Section */}
      <div
        className="p-8 bg-[#4e44ce] flex justify-center items-center"
      >
        <a href="/victory" target="_blank" rel="noopener noreferrer">
          <img
            src="/main.png"
            alt="Lottery Banner"
            style={{
              maxWidth: "100%", // Make the image responsive
              height: "auto", // Maintain aspect ratio
              borderRadius: "8px", // Optional: add rounded corners
            }}
          />
        </a>
      </div>
      {/* Game Cards Section */}
      <div style={{ padding: "20px" }}>
        <Grid container spacing={2}>
          {games.map((game, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <div
              className="flex items-center justify-center gap-4 shadow-lg rounded-xl hover:scale-95 transotion-all duration-300"
                onClick={() => handleCardClick(game.url)}
                style={{ cursor: "pointer" }}
              >
                <CardContent style={{ textAlign: "center" }}>
                  <img
                    src={game.image}
                    alt={game.name}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <Typography variant="h6">{game.name}</Typography>
                </CardContent>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
      {/* Bottom Navigation */}
      <BottomNav /> {/* Use the BottomNav component */}
    </div>
  );
}

export default App;
