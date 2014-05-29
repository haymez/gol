/*
 * This file contains the various matrices that can be loaded into a game
 * Author: James Miltenberger
 */

//Glider Gun
var gliderGun = [];
for(var i = 0; i < 37; i++) {
	gliderGun.push(new Array(9));
	for(var j = 0; j < 10; j++) {
		gliderGun[i][j] = false;
	}
}
gliderGun[1][5] = true;
gliderGun[1][6] = true;
gliderGun[2][5] = true;
gliderGun[2][6] = true;
gliderGun[11][5] = true;
gliderGun[11][6] = true;
gliderGun[11][7] = true;
gliderGun[12][4] = true;
gliderGun[12][8] = true;
gliderGun[13][3] = true;
gliderGun[13][9] = true;
gliderGun[14][3] = true;
gliderGun[14][9] = true;
gliderGun[15][6] = true;
gliderGun[16][4] = true;
gliderGun[16][8] = true;
gliderGun[17][5] = true;
gliderGun[17][6] = true;
gliderGun[17][7] = true;
gliderGun[18][6] = true;
gliderGun[21][3] = true;
gliderGun[21][4] = true;
gliderGun[21][5] = true;
gliderGun[22][3] = true;
gliderGun[22][4] = true;
gliderGun[22][5] = true;
gliderGun[23][2] = true;
gliderGun[23][6] = true;
gliderGun[25][1] = true;
gliderGun[25][2] = true;
gliderGun[25][6] = true;
gliderGun[25][7] = true;
gliderGun[35][3] = true;
gliderGun[35][4] = true;
gliderGun[36][3] = true;
gliderGun[36][4] = true;