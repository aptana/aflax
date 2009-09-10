#!/usr/bin/perl

# Flash XMLSocket Server and Client
# Copyright (c) 2001, Shengdar Tsai
# All rights reserved.

# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:

# Redistributions of source code must retain the above copyright notice, this
# list of conditions and the following disclaimer.

# Redistributions in binary form must reproduce the above copyright notice,
# this list of conditions and the following disclaimer in the documentation
# and/or other materials provided with the distribution.  Neither the name of
# the Heliant, Inc. nor the names of its contributors may be used to endorse or
# promote products derived from this software without specific prior written
# permission.

# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR
# ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


# Author's Notes

# This is an XMLSocket multiuser server, for use with Flash 5
# If you don't know what XMLSocket is, you shouldn't be using
# this program.  

use IO::Socket;
use IO::Select;

# Set the input terminator to a zero byte string, pursuant to the
# protocol in the flash documentation.
$/ = "\0";

# Create a new socket, on port 7777
$lsn = new IO::Socket::INET(Listen => 1, 
							LocalPort => 7777,
						    Reuse => 1,
						    Proto => 'tcp' )
   or die ("Couldn't start server: $!");

# Create an IO::Select handler
$sel = new IO::Select( $lsn );

# Close filehandles

close(STDIN); close(STDOUT);

warn "Server ready.  Waiting for connections . . . \n";

# Enter into while loop, listening to the handles that are available.
while( @read_ready = $sel->can_read ) {

	foreach $fh (@read_ready ) {

		# Create a new socket
		if($fh == $lsn) {
			$new = $lsn->accept;
			$sel->add($new);
			push( @data, "SERVER: User (" . fileno($new) . ") has joined.");
			warn "Connection from " . $new->peerhost . ".\n";
		}

		# Handle connection
		else {

			$input = <$fh>;
			
			chomp $input;
			
			if ( $input eq '') {
				push( @data, fileno($fh) . " has left.");
				warn "Disconnection from " . $new->peerhost . ".\n";				
				$sel->remove($fh);
				$fh->close;
			}
			else {
				$output = "(" . fileno($fh) . ") $input";
				push( @data, $output );
			}
		}
	}

	# Write to the clients that are available
	foreach $fh ( @write_ready = $sel->can_write(0) ) {
		foreach $line (@data) {
			print $fh "$line\0";
		}
	}
		
	undef @data;

}

warn "Server ended.\n";
