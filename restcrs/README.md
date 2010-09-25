# REST Computer reservations system
written by @dzuelke (Wombert) & @bigbluehat

## List of resources
* Airlines (UA, DL, LH)
** /airlines
** /airlines/UA
* Airports (CLT, MUC, IAH)
** /airports
** /airports/CLT
* Flights (one or more records per individual connection per day, also contains seatmap)
** /flights
** /flights/??flightnumber??
* Equipment (744, 346)
** /equipment
** /equipment/??equipnameid??
* PNR (the reservation on a specific flight for one or more passengers, http://en.wikipedia.org/wiki/Passenger_Name_Record)
** /pnr/??

## Useful links
* http://en.wikipedia.org/wiki/Computer_Reservation_System
* http://en.wikipedia.org/wiki/Passenger_Name_Record
* http://en.wikipedia.org/wiki/Record_locator

### Extras
* PHP seatmap output: http://pastie.org/private/96fmgoliwfrlhvp04lirg
