var gameImgSrc='images/';
var gameTexts = [];
gameTexts['win1']='Победил ';
gameTexts['win2']='!';
gameTexts['playing']='Ваш ход...';
gameTexts['start']='Begin game!';

var gameField=[];
function createField(width, height) {
	gameField = new Array(width);
	for (var i=0; i<width; i++) gameField[i] = new Array(height);

	var table = "<table cellpadding='0' cellspacing='0'>";
	for (var i=0; i<height;i++) {
		table+='<tr>';
		for (var j = 0; j < width; j++) {
			table+='<td>';
			table+="<img id='c"+j+"_"+i+"' src='"+gameImgSrc+"null.png' alt=' ' onclick='onCellClick("+j+","+i+")'>";
			table+='</td>';
		}
		table+='</tr>';
	}
	document.getElementById('game').innerHTML = table + '</table>';
	document.getElementById('gameinfo').innerText=gameTexts['start'];
};

function setCell(x,y,symbol) {
	gameField[x][y] = symbol;
	var imgSrc = gameImgSrc+'null.png';
	if (symbol == 'x') imgSrc = gameImgSrc+'x.png';
	if (symbol == 'o') imgSrc = gameImgSrc+'o.png';
	var imgName = 'c'+x+'_'+y;
	document.getElementById(imgName).src = imgSrc;
	if (symbol!=null) document.getElementById(imgName).alt = symbol;
};

function isWin() {
	for ( var selectTableX=0; selectTableX<=gameField.length-5; selectTableX++) for (var selectTableY=0; selectTableY<=gameField[0].length-4; selectTableY++) {
		var linkCell = gameField[selectTableX][selectTableY];
		if (linkCell!=null) for (var i=0; i<5; i++) if (gameField[i+selectTableX][i+selectTableY] != linkCell) linkCell=null;
		if (linkCell!=null) return linkCell;
		linkCell=gameField[4+selectTableX][selectTableY];
		if (linkCell!=null) for (var i=0; i<5; i++) if ( gameField[4-i+selectTableX][i+selectTableY] != linkCell ) linkCell=null;
		if (linkCell!=null) return linkCell;

		for (var i=0; i<5; i++) {
			linkCell=gameField[selectTableX+i][selectTableY];
			if (linkCell!=null) for (var j=0; j<5; j++) if (gameField[i+selectTableX][j+selectTableY] != linkCell) linkCell=null;
			if (linkCell!=null) return linkCell;
		}

		for (var i=0; i<5; i++) {
			linkCell = gameField[selectTableX][selectTableY+i];
			if (linkCell!=null) for (var j=0; j<5; j++) if (gameField[j+selectTableX][i+selectTableY] != linkCell) linkCell=null;
			if (linkCell!=null) return linkCell;
		}
	}

	return false;
}
function almostWin() {
	for ( var selectTableX=0; selectTableX<=gameField.length-4; selectTableX++) for (var selectTableY=0; selectTableY<=gameField[0].length-4; selectTableY++) {
		var linkCell = gameField[selectTableX][selectTableY];
		if (linkCell!=null) for (var i=0; i<4; i++) if (gameField[i+selectTableX][i+selectTableY] != linkCell) linkCell=null;
		if (linkCell!=null) return linkCell;
		linkCell=gameField[3+selectTableX][selectTableY];
		if (linkCell!=null) for (var i=0; i<4; i++) if ( gameField[3-i+selectTableX][i+selectTableY] != linkCell ) linkCell=null;
		if (linkCell!=null) return linkCell;

		for (var i=0; i<4; i++) {
			linkCell=gameField[selectTableX+i][selectTableY];
			if (linkCell!=null) for (var j=0; j<4; j++) if (gameField[i+selectTableX][j+selectTableY] != linkCell) linkCell=null;
			if (linkCell!=null) return linkCell;
		}

		for (var i=0; i<4; i++) {
			linkCell = gameField[selectTableX][selectTableY+i];
			if (linkCell!=null) for (var j=0; j<4; j++) if (gameField[j+selectTableX][i+selectTableY] != linkCell) linkCell=null;
			if (linkCell!=null) return linkCell;
		}
	}

	return false;
}

function ComputerGame() {
	var targetX=null, targetY=null, targetPriority=0;
	var selectTableX=0; selectTableY=0;
	for (selectTableX=0; selectTableX<gameField.length; selectTableX++) for (selectTableY=0; selectTableY<gameField[0].length; selectTableY++) {
		var linkCell = gameField[selectTableX][selectTableY];
		if ( (linkCell!='x')&&(linkCell!='o')) {
			gameField[selectTableX][selectTableY]='x';
			if ( almostWin() == 'x' || isWin() == 'x') {
				targetX = selectTableX; targetY=selectTableY;
				targetPriority = 3;
			} else if (targetPriority < 3) {
				gameField[selectTableX][selectTableY] = 'o';
				if ( isWin() =='o') {
					targetX = selectTableX; targetY = selectTableY;
					targetPriority = 2;
				} else if (targetPriority<2) {
					var minI =1, maxI =1; minJ = -1, maxJ = 0;
					if (selectTableX>=gameField.length-1) maxI=0;
					if (selectTableY>=gameField[0].length-1) maxJ=0;
					if (selectTableX<1) minI=0;
					if (selectTableY<1) minJ=0;

					for (var i=minI; i<=maxI; i++) for (var j=minJ; j<=maxJ; j++) if ( (i!=0) && (j!=0)) {
						if (gameField[selectTableX+i][selectTableY+j]=='o') {
							targetX = selectTableX; targetY = selectTableY;
							targetPriority = 1;
						}
					}
					if (targetPriority<1) {
						targetX = selectTableX; targetY = selectTableY;
					}
				}
			}
			gameField[selectTableX][selectTableY] = linkCell;
		}
	}
	if ( (targetX!=null)&&(targetY!=null) ) {
		setCell(targetX, targetY, 'o');
	}
}

function onCellClick(x,y) {
	if (gameField[x][y]==null) {
		var win = isWin();
		if ( !win ) setCell(x, y, 'x');
		win = isWin();
		if ( !win ) {
			ComputerGame();
			win = isWin();
		}
		if ( !win ) {
			gameinfo.innerText = gameTexts['playing']
		} else {
			var message = gameTexts['win1'] + win + gameTexts['win2'];
			document.getElementById('game').innerHTML = message;
			gameinfo.innerText = 'Игра окончена!';
		}
	}
}