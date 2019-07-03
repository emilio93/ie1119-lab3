/*
 * printf library for the MSP432
 *
 * Largely taken from and inspired from:
 * 	http://www.msp430launchpad.com/2012/06/using-printf.html
 *	http://www.43oh.com/forum/viewtopic.php?f=10&t=1732
 * 
 * See http://www.samlewis.me for an example implementation.
 */

#include <string>
#include <driverlib.h>

using namespace std;

void print_accel_values(int x, int y, int z)
{
  string accel_msg = "AccelValues:\tX:";
  accel_msg += to_string(x) +"\tY:"+ to_string(y) +"\tZ:"+to_string(z);
  accel_msg += "\r\n";
  for(int i = 0; i<accel_msg.length() ; i++){
    MAP_UART_transmitData(EUSCI_A0_BASE, accel_msg[i]);
  }
}

