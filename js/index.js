$(document).ready(function() {
  var offColor = { "background-color": "#E35858" };
  var onColor = { "background-color": "#95CA95" };
  var bounce = "animated bounce";

  var unClickable = "simon__game__color-unClickable";

  var firstSound = new Audio(
    "./audio/simonSound1.mp3"
  );
  var secondSound = new Audio(
    "./audio/simonSound2.mp3"
  );
  var thirdSound = new Audio(
    "./audio/simonSound3.mp3"
  );
  var fourthSound = new Audio(
    "./audio/simonSound4.mp3"
  );

  var simon = {
    isStarted: false,
    isStrict: false,
    count: 0,
    playerSequence: [],
    gameSequence: [],
    possibleSequence: ["#first", "#second", "#third", "#fourth"]
  };

  //Make color squares unclickable.
  function unclickable() {
    $(".simon__game__color").each(function() {
      $(this).addClass(unClickable);
    });
  }

  //Make color squares clickable.
  function clickable() {
    $(".simon__game__color").each(function() {
      $(this).removeClass(unClickable);
    });
  }

  //Reset game.
  function resetGame() {
    simon.isStarted = false;
    simon.gameSequence = [];
    simon.count = 0;
    $(".status__countInfo").text(simon.count);
    $(".status__startInfo").css(offColor);
    $(".status__start").text("Start");
  }

  //Start game and Simon moves.
  function startGame() {
    simon.isStarted = true;
    simon.playerSequence = [];
    $(".status__startInfo").css(onColor);
    $(".status__start").text("Stop");
    simonMove();
    simonMoves();
  }

  //Start or stop game.
  $(".status__start").click(function() {
    if (!simon.isStarted) {
      startGame();
      clickable();
    } else {
      resetGame();
      unclickable();
    }
  });

  //Strict mode on/off
  $(".status__strict").click(function() {
    if (!simon.isStrict) {
      simon.isStrict = true;
      $(".status__strictInfo").css(onColor);
    } else {
      simon.isStrict = false;
      $(".status__strictInfo").css(offColor);
    }
  });

  //Add random simon move to sequension.
  function simonMove() {
    simon.count++;
    $(".status__countInfo").text(simon.count);
    var square =
      simon.possibleSequence[
        Math.floor(Math.random() * simon.possibleSequence.length)
      ];
    simon.gameSequence.push(square);
  }

  //Show all simon moves, block buttons meantime.
  function simonMoves() {
    unclickable();
    var moves = 0;
    var movement = setInterval(function() {
      showMove(simon.gameSequence[moves]);
      moves++;
      if (moves >= simon.gameSequence.length) {
        setTimeout(function() {
          clickable();
        }, 1000);
        clearInterval(movement);
      }
    }, 1200);
  }

  //Show one move, style + sound.
  function showMove(square) {
    if (square == "#first") {
      firstSound.play();
    } else if (square == "#second") {
      secondSound.play();
    } else if (square == "#third") {
      thirdSound.play();
    } else {
      fourthSound.play();
    }
    $(square).addClass(bounce);
    $(square).addClass(unClickable);
    setTimeout(function() {
      $(square).removeClass(bounce);
      $(square).removeClass(unClickable);
    }, 800);
  }

  //Show players move and push it to player sequence.
  $(".simon__game__color").click(function() {
    showMove("#" + $(this).attr("id"));
    simon.playerSequence.push("#" + $(this).attr("id"));
    checkStatus("#" + $(this).attr("id"), simon.playerSequence.length);
  });

  //Check status every single move.
  function checkStatus(square, count) {
    setTimeout(function() {
      //25 wins game.
      if (simon.count > 20) {
        $(".status__title").text("You won!");
        resetGame();
        unclickable();
        setTimeout(function() {
          $(".status__title").text("Simon");
          startGame();
        }, 2000);
      } else if (simon.gameSequence[count - 1] == square) {
        //Stops showing movement when simon and player sequence is same.
        if (simon.gameSequence.length == simon.playerSequence.length) {
          simon.playerSequence = [];
          simonMove();
          simonMoves();
        }
      } else {
        //If it's strict mode, you lose.
        if (simon.isStrict) {
          $(".status__title").text("You lost!");
          resetGame();
          unclickable();
          setTimeout(function() {
            $(".status__title").text("Simon");
          }, 4000);
        } else {
          //If it's not a strict mode, repeat.
          $(".status__title").text("Try again!");
          simon.playerSequence = [];
          simonMoves();
          setTimeout(function() {
            $(".status__title").text("Simon");
          }, 4000);
        }
      }
    }, 1000);
  }
});