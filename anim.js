var player = 1;
var columnsNumber;
var rowsNumber;
var piecesNumber;
var piecesLeft;
var pieces;
var gameOver;

function init()
{
    gameOver = false;
    columnsNumber = 7;
    rowsNumber = 6;
    piecesNumber = columnsNumber * rowsNumber;
    piecesLeft = [];
    pieces = [];

    piecesLeft.push(Math.floor((columnsNumber * rowsNumber + .5) / 2));
    piecesLeft.push(Math.floor((columnsNumber * rowsNumber) / 2));
    for (var i = 0; i < piecesNumber; i++)
        pieces.push("noPlayer");
    createHtmlGame();
    showWiningPage();
    setSquares();
    addCaptureEvent();
}

function createHtmlGame()
{
    var htmlContainer = document.getElementById("container");
    var container = "";
    var area = ["", ""];

    for (var i = 0; i < piecesNumber; i++)
    {
        var row = Math.floor(i / columnsNumber);
        var column = i % columnsNumber;

        container += "<div class='square row" + row + " column" + column + "'>";
        container += "<div class='circle row" + row + " column" + column + " " +
            pieces[i] + "'>";
        container += "</div>";
        container += "</div>";

        var playerI = i % 2 + 1;
        var pieceNumber = piecesLeft[i % 2] - Math.floor(i / 2);
        var pieceId = "'piece" + playerI + "_" + pieceNumber + "'";
        area[i % 2] += "<div id=" + pieceId + " class='player" + playerI + " piece'></div>";
    }

    htmlContainer.innerHTML = container;
    document.getElementById("area1").innerHTML = area[0] +
        "<p class='playerName'> Player1 </p>";
    document.getElementById("area2").innerHTML = area[1] +
        "<p class='playerName'> Player2 </p>";
}

function setSquares()
{
    var style = document.documentElement.style;

    var widthScreen = document.body.clientWidth;
    var heightScreen = document.body.clientHeight;
    var squareSize = Math.floor(Math.min(
        0.9 * widthScreen / columnsNumber,
        heightScreen / (rowsNumber + 1.6)
    ));

    var containerSize = squareSize * columnsNumber;

    style.setProperty("--column-number", columnsNumber);
    style.setProperty("--square-size", squareSize + 'px');
    style.setProperty("--total-width", containerSize + "px");
    style.setProperty("--total-height", (squareSize * rowsNumber) + "px");
    style.setProperty("--header-height", 1.5 * squareSize + "px");

    $(".piece").css({"height": (0.2 * squareSize), "border-radius": (0.1 * squareSize)});

    if (widthScreen <= 1.25 * heightScreen) displayPlayer(false);
    else displayPlayer(true);
}

function displayPlayer(visible)
{
    var displayValue = "";
    if (!visible)
    {
        displayValue = "none";
        $("#gamePlay").css("grid-template-columns", "1fr var(--total-width) 1fr");
    }
    else
        $("#gamePlay").css("grid-template-columns", "auto var(--total-width) auto");

    $(".playerArea").css("display", displayValue);
}

function useMouse(evt)
{
    var element = evt.target;
    var elementClasses = element.className;
    var column = elementClasses.split("column")[1].split(" ")[0];

    if (evt.type === "mouseenter")
        changeColumnColor(column, "#538cff");
    else if (evt.type === "mouseleave")
        changeColumnColor(column, "blue");
    else if (evt.type === "mousedown")
    {
        if (!gameOver) changePieceColor(column);
        else init();
    }
}

function changePieceColor(column)
{
    var className = "circle noPlayer column" + column;
    var columnElements = document.getElementsByClassName(className);
    var length = columnElements.length;
    if (length > 0)
    {
        var columnElement = columnElements[columnElements.length - 1];
        var newPlayer = "player" + player;
        var pieceNumber = (length - 1) * columnsNumber + (+column);

        className = columnElement.className;
        className = className.replace("noPlayer", newPlayer);
        columnElement.setAttribute("class", className);
        pieces[pieceNumber] = newPlayer;
        checkWin(pieceNumber);
        changePlayer();
        checkGameOver();
    }
}

function changeColumnColor(column, color)
{
    var columnSquare = document.getElementsByClassName("square column" + column);
    for (var i = 0; i < columnSquare.length; i++)
    {
        columnSquare[i].style.backgroundColor = color;
    }
}

function changePlayer()
{
    changeOpacity("0.2");
    removePiece();
    player = 3 - player;
    changeOpacity("");
}

function removePiece()
{
    var piecesPlayerLeft = piecesLeft[player - 1];
    var pieceToRemove = document.getElementById("piece" + player + "_" + piecesPlayerLeft);
    pieceToRemove.style.setProperty("opacity", "0.4");
    piecesLeft[player - 1]--;
}

function changeOpacity(opacity)
{
    var pieces = document.getElementById("area" + player);
    pieces.style.setProperty("opacity", opacity);
}

function checkWin(position)
{
    if (countPieces(position, -1, -1, 0) + countPieces(position, 1, 1, 0) >= 3 ||
        countPieces(position, -1, 0, 0) + countPieces(position, 1, 0, 0) >= 3 ||
        countPieces(position, -1, 1, 0) + countPieces(position, 1, -1, 0) >= 3 ||
        countPieces(position, 0, -1, 0) + countPieces(position, 0, 1, 0) >= 3)
    {
        gameOver = true;
        showWiningPage();
    }
}

function showWiningPage()
{
    var htmlContainer = document.getElementById("container");
    var htmlWinner = document.getElementById("winner");
    var opacity;
    var display;
    var winnerContent;

    if (!gameOver)
    {
        opacity = "1";
        display = "none";
        winnerContent = "";
    }
    else
    {
        opacity = "0.2";
        display = "table";
        winnerContent = "<h2> The winner is player " + player + " ! </h2>";
    }
    htmlContainer.style.setProperty("opacity", opacity);
    htmlWinner.style.setProperty("display", display);
    htmlWinner.style.setProperty("color", "var(--player" + player + "-color)");
    htmlWinner.innerHTML = winnerContent;
}

function countPieces(position, i, j, n)
{
    var playerId = "player" + player;
    var old_x = position % columnsNumber;
    var old_y = Math.floor(position / columnsNumber);

    var new_x = old_x + i;
    var new_y = old_y + j;
    var new_position = new_y * columnsNumber + new_x;

    if (0 <= new_x && new_x < columnsNumber && 0 <= new_y && new_y < rowsNumber)
    {
        if (pieces[new_position] === playerId)
        {
            n = countPieces(new_position, i, j, ++n);
        }
    }
    return n;
}

function checkGameOver()
{
    if (piecesLeft[1] === 0)
    {
        gameOver = true;
    }
}

function addCaptureEvent()
{
    $(".square").on({
        "mouseenter": function (evt)
        {
            useMouse(evt)
        },
        "mouseleave": function (evt)
        {
            useMouse(evt)
        },
        "mousedown": function (evt)
        {
            useMouse(evt)
        }
    });
}

function main()
{

    $(document).ready(setSquares());
    window.addEventListener("resize", setSquares);

}

try
{
    init();
    main();
}
catch (ReferenceError)
{

}
