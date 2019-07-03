#!/bin/bash

declare DATACHANNEL='prueba'

while : ; do cat /dev/ttyACM0 | while read LINE; do mosquitto_pub -h 190.2.219.40 -t $DATACHANNEL -m "$LINE" ; done ; done

exit 0
