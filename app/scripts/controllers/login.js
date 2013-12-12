'use strict';

angular.module('classvantageApp')
  .controller('LoginCtrl', function ($scope, TokenHandler, $http, authService, oauth, $location, ENV, $stateParams) {
		
		if ($stateParams.token) {
			$scope.token = $stateParams.token;
		};
		
		
		var versionLessURL = ENV.baseURL.substr(0,ENV.baseURL.length-3);
		/*
		$scope.logOut = function () {
			$scope.$emit('event:auth-loginRequired')
			TokenHandler.set(null);
			delete $http.defaults.headers.common['Authorization'];
			$location.path('/signin');

		};
		*/
		
		// Default
		$scope.province = "Ontario";
		$scope.form = {school: ""};
		
		$scope.provinces = [
			"Ontario",
			"Quebec",
			"British Columbia",
			"Alberta",
			"Manitoba",
			"Saskatchewan",
			"Nova Scotia",
			"New Brunswick",
			"Newfoundland and Labrador",
			"Prince Edward Island",
			"Northwest Territories",
			"Yukon",
			"Nunavut"
		];
		
		if ($scope.me && $scope.me.name) {
			$location.path('/');
		};
		
		$scope.resetColor = function () {
			if ($scope.error && !$scope.error.message) $scope.error = 'normal';
		}
		
		$scope.logIn = function (username, password) {
			
			$scope.$on('event:auth-loginRequired', function (event) {
				$scope.error = 'red';
			});
			
			var payload = {
	      username: username || $scope.username,
	      password: password || $scope.password,
	      grant_type: 'password',
	      client_id: oauth.clientId,
	      client_secret: oauth.clientSecret
	    };

	    $http.post(oauth.endPoint, payload).success(
	        function( data ) {
	          TokenHandler.set( data.access_token );
						
						$http.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
						authService.loginConfirmed(data, function (config) {
							config.headers['Authorization'] = 'Bearer ' + data.access_token;
							return config;
						});
						
						$location.path($scope.$previousUrl || '/');
	        }
	    ).error(
					function( data, status, headers, config ) {
						// This is an error other than incorrect username or password, but includes no username or password (i.e. missing params)
						// for now, its handled the same
						$scope.error = 'red';
					}
			);
		};
		
		
		$scope.signUp = function () {
			var payload = {
	      email: $scope.username,
	      password: $scope.password,
	      province: $scope.province,
				school: $scope.form.school,
				name: $scope.name
	    };
	
			if ($scope.password !== $scope.password_confirmation) {
				$scope.error = ["Passwords don't match"];
				return;
			};
	
			$http.post(versionLessURL + 'register', payload).success(function (data) {
				mixpanel.people.set({
						"$name": payload.name,
				    "$email": payload.email,
						"$school": payload.school,
				    "$created": new Date()
				});
				$scope.logIn(payload.email, payload.password);
			}).error(function (data) {
				$scope.error = data.error;
			});
		
		};
		
		$scope.resetPassword = function () {
			var payload = {
				email: $scope.username
			};
			
			if (!$scope.username) {
				$scope.error = {message: "Please provide an email address"};
				return;
			};
			
			$http.post(versionLessURL + 'reset_password', payload).success(function (data) {
				alert('An email with password reset instructions has been sent to: ' + $scope.username);
			}).error(function (data) {
				$scope.error = {message: data.error};
			});
		}
		
		$scope.changePassword = function () {
			var payload = {
				token: $scope.token,
				password: $scope.me.password,
				password_confirmation: $scope.me.password_confirmation
			}
			
			if ($scope.me.password !== $scope.me.password_confirmation) {
				$scope.error = ["Passwords don't match"];
				return;
			};
			
			$http.post(versionLessURL + 'reset_password', payload).success(function (data) {
				alert("Password successfully changed.");
				$location.path('/signin');
			}).error(function (data) {
				$scope.error = {message: data.error.join('\n')};
			});
		}
		
		$scope.schools = [
		  "A A Wright Public School (Chatham-Kent)",
		  "Abbey Lane Public School (Oakville)",
		  "A B Ellis (Espanola)",
		  "Aberarder Central School (Plympton-Wyoming)",
		  "Aberdeen Public School (London)",
		  "Aberfoyle Public School (Guelph)",
		  "Abraham Erb Public School (Waterloo)",
		  "Académie de la Moraine (Richmond Hill)",
		  "Académie de la Tamise (London)",
		  "Académie La Pinède (Essa)",
		  "ACCESS Elementary (Vaughan)",
		  "Adam Beck Junior Public School (Toronto)",
		  "Adam Scott Intermediate School (Peterborough)",
		  "Adamsdale Public School (Greater Sudbury)",
		  "Adelaide Hoodless Public School (Hamilton)",
		  "Adelaide Mclaughlin Public School (Oshawa)",
		  "Adelaide - W G MacDonald Public School (Strathroy-Caradoc)",
		  "Adjala Central Public School (Adjala-Tosorontio)",
		  "Admaston Township Public School (Renfrew)",
		  "Admiral Collingwood Elementary School (Collingwood)",
		  "Adrienne Clarkson Elementary School (Ottawa)",
		  "Adrienne Clarkson Public School (Richmond Hill)",
		  "Africentric Alternative School (Toronto)",
		  "Agincourt Junior Public School (Toronto)",
		  "Agincourt Road Public School (Ottawa)",
		  "Agnes Hodge Public School (Brantford)",
		  "Agnes Macphail Public School (Toronto)",
		  "Agnes Taylor Public School (Brampton)",
		  "Agnew H Johnston Public School (Thunder Bay)",
		  "Aileen-Wright English Catholic School (Cochrane)",
		  "A J Baker Public School (Zorra)",
		  "A J Charbonneau Elementary Public School (Arnprior)",
		  "A K Wigg Public School (Pelham)",
		  "Albion Heights Junior Middle School (Toronto)",
		  "Alcona Glen Elementary School (Innisfil)",
		  "Aldborough Public School (West Elgin)",
		  "Aldergrove Public School (Markham)",
		  "Aldershot Elementary School (Burlington)",
		  "Alexander Graham Bell Public School (Ajax)",
		  "Alexander Kuska KSG Catholic Elementary School (Welland)",
		  "Alexander Muir/Gladstone Ave Junior and Senior Public School (Toronto)",
		  "Alexander Muir Public School (Newmarket)",
		  "Alexander Public School (Greater Sudbury)",
		  "Alexander's Public School (Burlington)",
		  "Alexander Stirling Public School (Toronto)",
		  "Alexandra Community School (Owen Sound)",
		  "Alexandra Public School (St. Catharines)",
		  "Alexandra Public School (Kawartha Lakes)",
		  "Alexmuir Junior Public School (Toronto)",
		  "Algonquin Avenue Public School (Thunder Bay)",
		  "Algonquin Public School (Woodstock)",
		  "Algonquin Ridge Elementary School (Barrie)",
		  "Algonquin Road Public School (Greater Sudbury)",
		  "Allan A Greenleaf Elementary (Hamilton)",
		  "Allan A Martin Senior Public School (Mississauga)",
		  "Allandale Heights Public School (Barrie)",
		  "Allan Drive Middle School (Caledon)",
		  "Allenby Junior Public School (Toronto)",
		  "Alliance French Immersion Public School (North Bay)",
		  "Alliston Union Public School (New Tecumseth)",
		  "Alloa Public School (Caledon)",
		  "All Saints Catholic Elementary School (Markham)",
		  "All Saints Catholic Intermediate School (Ottawa)",
		  "All Saints Catholic School (Mississauga)",
		  "All Saints Catholic School (Toronto)",
		  "Alma Public School (Mapleton)",
		  "Aloma Crescent Public School (Brampton)",
		  "A. Lorne Cassidy Elementary School (Ottawa)",
		  "ALPHA Alternative Junior School (Toronto)",
		  "ALPHA II Alternative School (Toronto)",
		  "Alpine Public School (Kitchener)",
		  "Alta Vista Public School (Ottawa)",
		  "Alternative Program Elementary School (Greater Sudbury)",
		  "Altona Forest Public School (Pickering)",
		  "Alton Public School (Caledon)",
		  "Amabel-Sauble Community School (Bruce Peninsula)",
		  "A M Cunningham Junior Public School (Hamilton)",
		  "Amesbury Middle School (Toronto)",
		  "Amherstburg Public School (Amherstburg)",
		  "Amherst Island Public School (Loyalist)",
		  "AmherstView Public School (Loyalist)",
		  "Ancaster Meadow Elementary Public School (Hamilton)",
		  "Ancaster Public School (Toronto)",
		  "Ancaster Senior Public School (Hamilton)",
		  "Anderdon Public School (Amherstburg)",
		  "Andrew Hunter Elementary School (Barrie)",
		  "Angus Morrison Elementary School (Essa)",
		  "Anna McCrea Public School (Sault Ste. Marie)",
		  "Anna Melick Memorial School (Haldimand)",
		  "Annandale Public School (Tillsonburg)",
		  "Anne Hathaway Public School (Stratford)",
		  "Annette Street Junior and Senior Public School (Toronto)",
		  "Annunciation Catholic School (Toronto)",
		  "Annunciation of Our Lord Elementary School (Hamilton)",
		  "Anson Park Public School (Toronto)",
		  "Anson S Taylor Junior Public School (Toronto)",

		  "Applecroft Public School (Ajax)",
		  "Applewood Public School (St. Catharines)",


		  "Apsley Central Public School (North Kawartha)",


		  "Arbor Glen Public School (Toronto)",


		  "Archbishop O'Sullivan Catholic School (Kingston)",


		  "Archie Stouffer Elementary School (Minden Hills)",


		  "Arch Street Public School (Ottawa)",


		  "Ardagh Bluffs Public School (Barrie)",


		  "Ardtrea/Cumberland Beach Public School (Severn)",


		  "Argyle Public School (Port Loring)",


		  "A R Kaufman Public School (Kitchener)",


		  "Arklan Community Public School (Carleton Place)",


		  "Arlington Middle School (Toronto)",


		  "Armadale Public School (Markham)",


		  "Armitage Village Public School (Newmarket)",


		  "Armour Heights Public School (Toronto)",


		  "Armour Heights Public School (Peterborough)",


		  "Armstrong Elementary School (Armstrong)",


		  "Arnott Charlton Public School (Brampton)",


		  "Arran Tara Elementary School (Arran-Elderslie)",


		  "Artesian Drive Public School (Mississauga)",


		  "Arthur Ford Public School (London)",


		  "Arthur Henderson Public School (Bruce Mines)",


		  "Arthur Public School (Wellington North)",


		  "Arthur Stringer Public School (London)",


		  "Ascension Separate School (Burlington)",


		  "Ashgrove Public School (Mississauga)",


		  "Ashley Oaks Public School (London)",


		  "Ashton Meadows Public School (Markham)",


		  "Assiginack Public School (Assiginack)",


		  "Assikinack Public School (Barrie)",


		  "Assumption Catholic Elementary School (St. Catharines)",


		  "Assumption Elementary School (Ottawa)",


		  "Assumption Separate School (Aylmer)",


		  "Athabasca Street Public School (Oshawa)",


		  "Athol-South Marysburgh School Public School (Prince Edward County)",


		  "Atikokan High School Elementary (Atikokan)",


		  "Aurora Grove Public School (Aurora)",


		  "Aurora Heights Public School (Aurora)",


		  "Aurora Senior Public School (Aurora)",


		  "Avalon Public School (Ottawa)",


		  "Avenue Road Public School (Cambridge)",


		  "A V Graham Public School (Windsor)",


		  "Avondale Alternative Elementary School (Toronto)",


		  "Avondale Public School (Toronto)",


		  "Avon Public School (Stratford)",


		  "Aweres Public School (Sault Ste. Marie)",


		  "Ayr Public School (North Dumfries)",


		  "Baden Public School (Wilmot)",


		  "Bakersfield Public School (Thornhill)",


		  "Bala Avenue Community School (Toronto)",


		  "Balaclava Public School (Hamilton)",


		  "Ballantrae Public School (Whitchurch-Stouffville)",


		  "Balmoral Drive Senior Public School (Brampton)",


		  "Balmy Beach Community School (Toronto)",


		  "Baltimore Public School (Hamilton)",


		  "Banbury Heights School (Brantford)",


		  "Banting and Best Public School (Toronto)",


		  "B A Parker Public School (Greenstone)",


		  "Barondale Public School (Mississauga)",


		  "Barrhaven Public School (Ottawa)",


		  "Bath Public School (Loyalist)",


		  "Baxter Central Public School (Essa)",


		  "Baycrest Public School (Toronto)",


		  "Bayridge Public School (Kingston)",


		  "Bayshore Public School (Ottawa)",


		  "Bayside Public School (Belleville)",


		  "Baythorn Public School (Thornhill)",


		  "Bayview Fairways Public School (Thornhill)",


		  "Bayview Glen Public School (Thornhill)",


		  "Bayview Heights Public School (Pickering)",


		  "Bayview Hill Elementary School (Richmond Hill)",


		  "Bayview Middle School (Toronto)",


		  "Bayview Northeast #2 ES (Aurora)",


		  "Bayview Public School (Ottawa)",


		  "Bayview Public School (Owen Sound)",


		  "Bayview Public School (Midland)",


		  "Beachburg Public School (Whitewater)",


		  "Beaches Alternative Junior School (Toronto)",


		  "Beardmore Public School (Greenstone)",


		  "Beatrice Strong Public School (Port Hope)",


		  "Beatty-Fleming Sr Public School (Brampton)",


		  "Beaumonde Heights Junior Middle School (Toronto)",


		  "Beau Valley Public School (Oshawa)",


		  "Beavercrest Community School (Grey Highlands)",


		  "Beaverton Public School (Brock)",


		  "Beaver Valley Community School (The Blue Mountains)",


		  "Beckwith Public School (Carleton Place)",


		  "Bedford Park Public School (Toronto)",


		  "Bedford Public School (Stratford)",


		  "Belfountain Public School (Caledon)",


		  "Belle River Public School (Lakeshore)",


		  "Bellewood Public School (Windsor)",


		  "Bellmere Junior Public School (Toronto)",


		  "Bellmoore Public School (Hamilton)",


		  "Bells Corners Public School (Ottawa)",


		  "Bell Stone Public School (Hamilton)",


		  "Bellview Public School (Brantford)",


		  "Bellwood Public School (Whitby)",


		  "Bendale Junior Public School (Toronto)",


		  "Bennetto Elementary School (Hamilton)",


		  "Bennington Heights Elementary School (Toronto)",


		  "Ben R McMullin Public School (Sault Ste. Marie)",


		  "Benson Public School (Edwardsburgh/Cardinal)",


		  "Berner Trail Junior Public School (Toronto)",


		  "Bernier-Stokes Elementary School (Collins)",


		  "Berrigan Elementary School (Ottawa)",


		  "Bertha Shaw Public School (Timmins)",


		  "Bertie Public School (Fort Erie)",


		  "Beryl Ford (Brampton)",


		  "Bessborough Drive Elementary and Middle School (Toronto)",


		  "Beverley Acres Public School (Richmond Hill)",


		  "Beverley Heights Middle School (Toronto)",


		  "Beverley School (Toronto)",


		  "Beverly Central Public School (Hamilton)",


		  "Beverly Glen Junior Public School (Toronto)",


		  "Billy Green Elementary School (Hamilton)",


		  "Binbrook Elementary (Hamilton)",


		  "Birchbank Public School (Brampton)",


		  "Birch Cliff Heights Public School (Toronto)",


		  "Birch Cliff Public School (Toronto)",


		  "Birchview Dunes Elementary School (Wasaga Beach)",


		  "Birds Creek Public School (Bancroft)",


		  "Bishop Belleau School (Moosonee)",


		  "Bishop E. Q. Jennings Senior Elementary School (Thunder Bay)",


		  "Bishop Francis Allen Catholic School (Brampton)",


		  "Bishop Gallagher Senior Catholic Elementary School (Thunder Bay)",


		  "Bishop Macdonell Separate School (Cornwall)",


		  "Bishop Scalabrini School (Mississauga)",


		  "Bishop Smith Separate School (Pembroke)",


		  "Bishop Townshend Public School (London)",


		  "Black River Public School (Georgina)",


		  "Blacksmith Public School (Toronto)",


		  "Blair Ridge Public School (Whitby)",


		  "Blair Road Public School (Cambridge)",


		  "Blake Street Junior Public School (Toronto)",


		  "Blantyre Public School (Toronto)",


		  "Blaydon Public School (Toronto)",


		  "Blenheim District Public School (Blandford-Blenheim)",


		  "Blessed John Paul II Catholic Elementary School (Richmond Hill)",


		  "Blessed John Paul II Elementary School (Hamilton)",


		  "Blessed John XXIII Catholic Elementary School (Mississauga)",


		  "Blessed John XXIII Catholic Elementary School (Markham)",


		  "Blessed John XXIII Catholic School (Toronto)",


		  "Blessed Kateri Catholic Elementary School (Kitchener)",


		  "Blessed Kateri Separate School (London)",


		  "Blessed Kateri Tekakwitha (Hamilton)",


		  "Blessed Kateri Tekakwitha Catholic School (Toronto)",


		  "Blessed Kateri Tekakwitha Elementary School (Ottawa)",


		  "Blessed Margherita of Citta Castello Catholic School (Toronto)",


		  "Blessed Pier Giorgio Frassati Catholic School (Toronto)",


		  "Blessed Sacrament Catholic Elementary School (Kitchener)",


		  "Blessed Sacrament Catholic School (Toronto)",


		  "Blessed Sacrament School (Brant)",


		  "Blessed Sacrament Separate School (Hamilton)",


		  "Blessed Sacrament Separate School (London)",


		  "Blessed Scalabrini Catholic Elementary School (Thornhill)",


		  "Blessed Teresa of Calcutta Catholic Elementary School (Mississauga)",


		  "Blessed Teresa of Calcutta Elementary School (Hamilton)",


		  "Blessed Trinity Catholic Elementary School (Vaughan)",


		  "Blessed Trinity Catholic School (Toronto)",


		  "Blind River Public School (Blind River)",


		  "Bliss Carman Senior Public School (Toronto)",


		  "Bloomsburg Public School (Norfolk County)",


		  "Bloordale Middle School (Toronto)",


		  "Bloorlea Middle School (Toronto)",


		  "Bloorview School Authority (Toronto)",


		  "Blossom Park Public School (Ottawa)",


		  "Blue Willow Public School (Vaughan)",


		  "Blyth Public School (North Huron)",


		  "Blythwood Junior Public School (Toronto)",


		  "Bobby Orr Public School (Oshawa)",


		  "Bobcaygeon Public School (Kawartha Lakes)",


		  "Bogart Public School (Newmarket)",


		  "Bolton C Falby Public School (Ajax)",


		  "Bonaventure Meadows Public School (London)",


		  "Bond Lake Public School (Richmond Hill)",


		  "Bosanquet Central Public School (Lambton Shores)",


		  "Boston Public School (Norfolk County)",


		  "Bowmanville Intermediate School (Clarington)",


		  "Bowmore Road Junior and Senior Public School (Toronto)",


		  "Boxwood Public School (Markham)",


		  "Bracebridge Public School (Bracebridge)",


		  "Bradford Elementary School (Bradford West Gwillimbury)",


		  "Braeburn Junior School (Toronto)",


		  "Brameast # 4 PS (Brampton)",


		  "Brampton East Elementary ()",


		  "Bramwest Sub Area 1 P.S. (Brampton)",


		  "Brandon Gate Public School (Mississauga)",


		  "Branlyn Community School (Brantford)",


		  "Brant Avenue Public School (Guelph)",


		  "Brant Hills Public School (Burlington)",


		  "Brant Township Central School (Brockton)",


		  "Breadner Elementary School (Quinte West)",


		  "Brechin Public School (Ramara)",


		  "Breslau Public School (Woolwich)",


		  "Brian Public School (Toronto)",


		  "Brian W. Fleming Public School (Mississauga)",


		  "Briarcrest Junior School (Toronto)",


		  "Briardale Public School (St. Catharines)",


		  "Briargreen Public School (Ottawa)",


		  "Briar Hill Junior Public School (Toronto)",


		  "Briarwood Public School (Mississauga)",


		  "Bridgeport Public School (Kitchener)",


		  "Bridgeview Public School (Point Edward)",


		  "Bridlewood Community Elementary School (Ottawa)",


		  "Bridlewood Junior Public School (Toronto)",


		  "Brier Park Public School (Brantford)",


		  "Brigadoon Public School (Kitchener)",


		  "Brigden School (St. Clair)",


		  "Brighton Public School (Brighton)",


		  "Bright's Grove Public School (Sarnia)",


		  "Brimwood Boulevard Junior Public School (Toronto)",


		  "Brisbane Public School (Erin)",


		  "Brisdale Public School (Brampton)",


		  "Bristol Road Middle School (Mississauga)",


		  "Britannia Public School (Mississauga)",


		  "Britt Public School (Wallbridge)",


		  "Broadacres Junior Public School (Toronto)",


		  "Broadlands Public School (Toronto)",


		  "Broadview Public School (Ottawa)",


		  "Brock Public School (Toronto)",


		  "Brookdale Public School (Oakville)",


		  "Brooke Central School (Brooke-Alvinston)",


		  "Brookhaven Public School (Toronto)",


		  "Brooklin Village Public School (Whitby)",


		  "Brookmede Public School (Mississauga)",


		  "Brookmill Boulevard Junior Public School (Toronto)",


		  "Brookside Public School (Huron-Kinloss)",


		  "Brookside Public School (Toronto)",


		  "Brooks Road Public School (Toronto)",


		  "Brookview Middle School (Toronto)",


		  "Brookville Public School (Milton)",


		  "Brother Andre Catholic Elementary School (Ottawa)",


		  "Brother Andre Catholic School (Ajax)",


		  "Brown Junior Public School (Toronto)",


		  "Brownridge Public School (Thornhill)",


		  "Bruce Junior Public School (Toronto)",


		  "Bruce Peninsula District School (Lion S Head)",


		  "Bruce T Lindley (Burlington)",


		  "Bruce Trail Public School (Milton)",


		  "Brussels Public School (Huron East)",


		  "Buchanan Park School (Hamilton)",


		  "Buchanan Public School (Toronto)",


		  "Buckhorn Public School (Galway-Cavendish And Harvey)",


		  "Burford District Elementary School (Brant)",


		  "Burkevale Protestant Separate School (Penetanguishene)",


		  "Burleigh Hill Public School (St. Catharines)",


		  "Burlington Central Elementary School (Burlington)",


		  "Burnham School (Cobourg)",


		  "Burnhamthorpe Public School (Mississauga)",


		  "Burnt Elm Public School (Brampton)",


		  "Burrows Hall Junior Public School (Toronto)",


		  "Buttonville Public School (Markham)",


		  "Byng Public School (Clearview)",


		  "Byron Northview Public School (London)",


		  "Byron Somerset Public School (London)",


		  "Byron Southwood Public School (London)",


		  "Cadarackque Public School (Ajax)",


		  "Caistor Central Public School (West Lincoln)",


		  "Calderstone Middle Middle School (Brampton)",


		  "Caldwell Street Elementary School (Carleton Place)",


		  "Caledon Central Public School (Caledon)",


		  "Caledon East Public School (Caledon)",


		  "Caledonia Centennial Public School (Haldimand County)",


		  "Calico Public School (Toronto)",


		  "Calvin Park Public School (Kingston)",


		  "Camborne Public School (Cobourg)",


		  "Cambridge Public School (Russell)",


		  "Cambridge Street Community Public School (Ottawa)",


		  "Cameron Public School (Toronto)",


		  "Cameron Street Public School (Collingwood)",


		  "Camilla Road Senior Public School (Mississauga)",


		  "Campbell Children's School (Oshawa)",


		  "Campden Public School (Lincoln)",


		  "Canadian Martyrs Catholic Elementary School (Kitchener)",


		  "Canadian Martyrs Catholic Elementary School (St. Catharines)",


		  "Canadian Martyrs Catholic Elementary School (Newmarket)",


		  "Canadian Martyrs Catholic School (Penetanguishene)",


		  "Canadian Martyrs Catholic School (Toronto)",


		  "Canadian Martyrs School (Hamilton)",


		  "Canadian Martyrs School (Mississauga)",


		  "Canadian Martyrs School (Burlington)",


		  "Captain Michael VandenBos Public School (Whitby)",


		  "Captain R. Wilson Public School (Oakville)",


		  "Caradoc North School (Strathroy-Caradoc)",


		  "Caradoc Public School (Strathroy-Caradoc)",


		  "Caramat District Public School (Greenstone)",


		  "Carambeck Public School (Carleton Place)",


		  "Carberry Public School (Brampton)",


		  "Cardiff Elementary School (Highlands East)",


		  "Cardinal Carter Academy for the Arts (Toronto)",


		  "Cardinal Heights Middle School (Hamilton)",


		  "Cardinal Leger Catholic School (Toronto)",


		  "Cardinal Newman Catholic Elementary School (Niagara Falls)",


		  "Cardinal Newman Catholic School (Brampton)",


		  "Carl A Nesbitt Public School (Greater Sudbury)",


		  "Carleton Heights Public School (Ottawa)",


		  "Carleton Public School (St. Catharines)",


		  "Carleton Village Junior and Senior Public School (Toronto)",


		  "Carruthers Creek Public School (Ajax)",


		  "Carrville Mills Public School (Thornhill)",


		  "Carson Grove Elementary School (Ottawa)",


		  "Cartwright Central Public School (Scugog)",


		  "Cashmere Avenue Public School (Mississauga)",


		  "Cassandra Public School (Toronto)",


		  "Castlebridge Public School (Mississauga)",


		  "Castlefrank Elementary School (Ottawa)",


		  "Castlemore Elementary Public School (Markham)",


		  "Castlemore Public School (Brampton)",


		  "Castor Valley Elementary School (Ottawa)",


		  "Cataraqui Woods Elementary School (Kingston)",


		  "Cathcart Boulevard Public School (Sarnia)",


		  "Cathedral Catholic School (Pembroke)",


		  "Cathedrale Catholic School (Kingston)",


		  "Cathedral West #1 (Markham)",


		  "Cathy Wever Elementary Public School (Hamilton)",


		  "C C Carrothers Public School (London)",


		  "C D Farquharson Junior Public School (Toronto)",


		  "C D Howe Public School (Thunder Bay)",


		  "C E Broughton Public School (Whitby)",


		  "Cecil B Stirling School (Hamilton)",


		  "Cedarbrae Public School (Waterloo)",


		  "Cedarbrook Public School (Toronto)",


		  "Cedar Creek Public School (North Dumfries)",


		  "Cedar Drive Junior Public School (Toronto)",


		  "Cedarland Public School (Brantford)",


		  "Cedarvale Community School (Toronto)",


		  "Cedarview Middle School (Ottawa)",


		  "Cedarwood Public School (Markham)",


		  "Centennial 67 Public School (Edwardsburgh/Cardinal)",


		  "Centennial (Cambridge) Public School (Cambridge)",


		  "Centennial Central Public School (Lakeshore)",


		  "Centennial Central School (Middlesex Centre)",


		  "Centennial-Grand Woodlands School (Brantford)",


		  "Centennial Hylands Elementary School (Shelburne)",


		  "Centennial Middle School (Halton Hills)",


		  "Centennial Public School (Kingston)",


		  "Centennial Public School (Ottawa)",


		  "Centennial Road Junior Public School (Toronto)",


		  "Centennial Senior Public School (Brampton)",


		  "Centennial (Waterloo) Public School (Waterloo)",


		  "Central Avenue Public School (Elliot Lake)",


		  "Central Junior Public School (Hamilton)",


		  "Central Manitoulin Public School (Central Manitoulin)",


		  "Central Park Public School (Markham)",


		  "Central Perth Elementary School (Perth South)",


		  "Central Public School (Brantford)",


		  "Central Public School (Renfrew)",


		  "Central Public School (Cambridge)",


		  "Central Public School (Kingston)",


		  "Central Public School (Guelph)",


		  "Central Public School (Cornwall)",


		  "Central Public School (Woodstock)",


		  "Central Public School (Clarington)",


		  "Central Public School (Windsor)",


		  "Central Public School (Grimsby)",


		  "Central Public School (Burlington)",


		  "Central School (Kirkland Lake)",


		  "Central Senior School (Kawartha Lakes)",


		  "Centre Jules-Léger ÉA Difficulté (Ottawa)",


		  "Centre Jules-Léger ÉP Surdicécité (Ottawa)",


		  "Centre Jules-Léger ÉP Surdité palier (Ottawa)",


		  "Centre Peel Public School (Mapleton Township)",


		  "Centreville Public School (Stone Mills)",


		  "Century Public School (Ottawa)",


		  "Chalkfarm Public School (Toronto)",


		  "Chalmers Street Public School (Cambridge)",


		  "Champlain Discovery Public School (Pembroke)",


		  "Champlain Trail Public School (Mississauga)",


		  "Chapel Hill Catholic Elementary School (Ottawa)",


		  "Chapleau Public School (Chapleau)",


		  "Char-Lan Intermediate School (South Glengarry)",


		  "Charles Bowman Public School (Clarington)",


		  "Charles C McLean Public School (Gore Bay)",


		  "Charles E Webster Public School (Toronto)",


		  "Charles G Fraser Junior Public School (Toronto)",


		  "Charles Gordon Senior Public School (Toronto)",


		  "Charles H Best Middle School (Toronto)",


		  "Charles H. Hulse Public School (Ottawa)",


		  "Charles Howitt Public School (Richmond Hill)",


		  "Charles R. Beaudoin Public School (Burlington)",


		  "Charlottetown Junior Public School (Toronto)",


		  "Charlton Public School (Thornhill)",


		  "Charlton-Savard Public School (Charlton And Dack)",


		  "Chartland Junior Public School (Toronto)",


		  "C H Bray School (Hamilton)",


		  "Chedoke Middle School (Hamilton)",


		  "Chelmsford Public School (Greater Sudbury)",


		  "Chelmsford Valley District School (Greater Sudbury)",


		  "Chemong Public School (Smith-Ennismore-Lakefield)",


		  "Cherokee Public School (Toronto)",


		  "Cherrytree Public School (Brampton)",


		  "Cherrywood Acres Public School (Niagara Falls)",


		  "Chester Elementary School (Toronto)",


		  "Chester Le Junior Public School (Toronto)",


		  "Chesterville Public School (North Dundas)",


		  "Cheyne Middle School (Brampton)",


		  "Chief Dan George Public School (Toronto)",


		  "Chimo Elementary School (Smiths Falls)",


		  "Chine Drive Public School (Toronto)",


		  "Chippewa Intermediate School (North Bay)",


		  "Chippewa Public School (London)",


		  "C H Norton Public School (Burlington)",


		  "Chris Hadfield Public School (Milton)",


		  "Christ the King Catholic Elementary School (Richmond Hill)",


		  "Christ The King Catholic Elementary School (Cambridge)",


		  "Christ the King Catholic School (Toronto)",


		  "Christ the King Catholic School (Chatham-Kent)",


		  "Christ The King Catholic School (Mississauga)",


		  "Christ the King School (Brantford)",


		  "Christ the King Separate School (Windsor)",


		  "Churchill Alternative School (Ottawa)",


		  "Churchill Heights Public School (Toronto)",


		  "Churchill Meadows Public School (Mississauga)",


		  "Churchill Public School (Toronto)",


		  "Churchill Public School (Greater Sudbury)",


		  "Church Street Junior Public School (Toronto)",


		  "City View Alternative Senior School (Toronto)",


		  "Claireville Junior School (Toronto)",


		  "Claireville Public School (Brampton)",


		  "Clairlea Public School (Toronto)",


		  "Clara Brenton Public School (London)",


		  "Claremont Public School (Pickering)",


		  "Clarendon Central Public School (North Frontenac)",


		  "Clark Boulevard Public School (Brampton)",


		  "Clarksdale Public School (Burlington)",


		  "Clarkson Public School (Mississauga)",


		  "Claude E Garton Public School (Thunder Bay)",


		  "Claude Watson School for the Arts (Toronto)",


		  "Clayton Brown Public School (Hearst)",


		  "Cleardale Public School (London)",


		  "Clearmeadow Public School (Newmarket)",


		  "Clearview Meadows Elementary School (Clearview)",


		  "Clemens Mill Public School (Cambridge)",


		  "Clifford Bowey Public School (Ottawa)",


		  "Cliffside Public School (Toronto)",


		  "Cliffwood Public School (Toronto)",


		  "Clifton Public School (Mississauga)",


		  "Clinton Public School (Central Huron)",


		  "Clinton Street Junior Public School (Toronto)",


		  "C M L Snider Elementary School (Prince Edward County)",


		  "Cobalt Public School (Cobalt)",


		  "Cobblestone Elementary School (Brant)",


		  "Cobden District Public School (Whitewater Region)",


		  "Cochrane Public School (Cochrane)",


		  "Codrington Public School (Barrie)",


		  "Coe Hill Public School (Wollaston)",


		  "Colborne Central School (Goderich)",


		  "Colborne School (Cramahe)",


		  "Colborne Street School (Strathroy-Caradoc)",


		  "Colchester North Public School (Essex)",


		  "Coldwater Public School (Severn)",


		  "Coledale Public School (Markham)",


		  "Collège français élémentaire (Toronto)",


		  "College Hill Public School (Oshawa)",


		  "College Street Public School (Quinte West)",


		  "College Street Public School (West Lincoln)",


		  "Collegiate Avenue School (Hamilton)",


		  "Collins Bay Public School (Kingston)",


		  "Colonel Cameron Public School (St. Clair)",


		  "Colonel J E Farewell Public School (Whitby)",


		  "Commonwealth Public School (Brockville)",


		  "Conestoga Public School (Brampton)",


		  "Conestogo PS (Woolwich)",


		  "Confederation Central School (Sarnia)",


		  "Connaught Public School (St. Catharines)",


		  "Connaught Public School (Ottawa)",


		  "Connaught Public School (Collingwood)",


		  "Convent Glen Catholic Elementary School (Ottawa)",


		  "Convent Glen Elementary School (Ottawa)",


		  "Cookstown Central Public School (Innisfil)",


		  "Cooksville Creek Public School (Mississauga)",


		  "Copeland Public School (Brampton)",


		  "Coppard Glen Public School (Markham)",


		  "Copper Cliff Public School (Greater Sudbury)",


		  "Cordella Junior Public School (Toronto)",


		  "Corliss Public School (Mississauga)",


		  "Cornell Junior Public School (Toronto)",


		  "Cornell Northeast #3 (Markham)",


		  "Cornell Village Public School (Markham)",


		  "Cornwall Intermediate School (Cornwall)",


		  "Coronation Public School (Windsor)",


		  "Coronation Public School (Oshawa)",


		  "Coronation Public School (Cambridge)",


		  "Corpus Christi Catholic Elementary School (Thunder Bay)",


		  "Corpus Christi Catholic Elementary School (Richmond Hill)",


		  "Corpus Christi Catholic School (Greater Sudbury)",


		  "Corpus Christi Elementary School (Ottawa)",


		  "Corpus Christi School (Hamilton)",


		  "Corpus Christi School (Mississauga)",


		  "Corpus Christi Separate School (North Bay)",


		  "Corsair Public School (Mississauga)",


		  "Corvette Junior Public School (Toronto)",


		  "Cosburn Middle School (Toronto)",


		  "Cottingham Junior Public School (Toronto)",


		  "Couchiching Heights Public School (Orillia)",


		  "Country Hills Public School (Kitchener)",


		  "Courcelette Public School (Toronto)",


		  "Courtice North Public School (Clarington)",


		  "Courtland Avenue Public School (Kitchener)",


		  "Courtland Public School (Norfolk County)",


		  "Credit Meadows Elementary School (Orangeville)",


		  "Credit Valley Elementary ()",


		  "Credit Valley Public School (Mississauga)",


		  "Credit Valley Sub Area 2 # 1 PS (Brampton)",


		  "Credit Valley Sub Area 2 #2 Public School ()",


		  "Credit View Public School (Caledon)",


		  "Crescent Town Elementary School (Toronto)",


		  "Cresthaven Public School (Toronto)",


		  "Crestview Public School (Oliver Paipoonge)",


		  "Crestview Public School (Kitchener)",


		  "Crestview Public School (Toronto)",


		  "Crestwood Elem Alter Ed Program Elementary School (Hamilton)",


		  "C R Gummow School (Cobourg)",


		  "C R Judd Public School (Greater Sudbury)",


		  "C R Marchant Middle School (Toronto)",


		  "Crolancia Public School (Pickle Lake)",


		  "Crosby Heights Public School (Richmond Hill)",


		  "Crossland Public School (Newmarket)",


		  "Crossroads Elementary Public School (La Vallee)",


		  "Crossroads Public School (Niagara On The Lake)",


		  "Crowland Central Public School (Welland)",


		  "Crystal Bay Centre for Special (Ottawa)",


		  "Crystal Beach Public School (Fort Erie)",


		  "Cummer Valley Middle School (Toronto)",


		  "Cundles Heights Public School (Barrie)",


		  "Cyril Varney Public School (Greater Sudbury)",


		  "D A Gordon Public School (Chatham-Kent)",


		  "Dale Road Senior School (Cobourg)",


		  "Dalewood Senior Public School (St. Catharines)",


		  "Dalewood Senior Public School (Hamilton)",


		  "Dallington Public School (Toronto)",


		  "D A Morrison Middle School (Toronto)",


		  "Danforth Gardens Public School (Toronto)",


		  "Darcel Avenue Senior Public School (Mississauga)",


		  "D'Arcy McGee Catholic School (Toronto)",


		  "D. Aubrey Moodie Intermediate School (Ottawa)",


		  "Davenport Public School (Aylmer)",


		  "David Hornell Junior School (Toronto)",


		  "David Leeder Middle School (Mississauga)",


		  "David Lewis Public School (Toronto)",


		  "David Maxwell Public School (Windsor)",


		  "David Suzuki Public School (Markham)",


		  "da Vinci School (Toronto)",


		  "Davisville Junior Public School (Toronto)",


		  "Dawn-Euphemia School (Chatham-Kent)",


		  "Dawnview Public School (Hanover)",


		  "Daystrom Public School (Toronto)",


		  "Deer Park Junior and Senior Public School (Toronto)",


		  "Deer Park Public School (Georgina)",


		  "Delaware Central School (Middlesex Centre)",


		  "Delhi Public School (Norfolk)",


		  "Delta Senior Alternative School (Toronto)",


		  "Denlow Public School (Toronto)",


		  "Denne Public School (Newmarket)",


		  "Dennis Avenue Community School (Toronto)",


		  "Derby Public School (Owen Sound)",


		  "Derrydown Public School (Toronto)",


		  "Derry West Village Public School (Mississauga)",


		  "Deseronto Public School (Deseronto)",


		  "Devins Drive Public School (Aurora)",


		  "Devonshire Community Public School (Ottawa)",


		  "DeWitt Carter Public School (Port Colborne)",


		  "Dewson Street Junior Public School (Toronto)",


		  "Diamond Jubilee Public School (Kapuskasing)",


		  "Dickson Public School (Cambridge)",


		  "Diefenbaker Elementary School (Toronto)",


		  "Discovery Public School (Vaughan)",


		  "Divine Infant Elementary School (Ottawa)",


		  "Divine Mercy Catholic Elementary School (Vaughan)",


		  "Divine Mercy School (Mississauga)",


		  "Dixie Public School (Mississauga)",


		  "Dixon Grove Junior Middle School (Toronto)",


		  "D M Eagle Public School (Tecumseh)",


		  "Dolphin Senior Public School (Mississauga)",


		  "Donald Cousens Public School (Markham)",


		  "Donald Young Public School (Emo)",


		  "Doncrest Public School (Richmond Hill)",


		  "Don Mills Middle School (Toronto)",


		  "Don Valley Junior High School (Toronto)",


		  "Donview Middle School (Toronto)",


		  "Donwood Park Junior Public School (Toronto)",


		  "Doon Public School (Kitchener)",


		  "Dorion Public School (Dorion)",


		  "Dorset Drive Public School (Brampton)",


		  "Dorset Park Public School (Toronto)",


		  "Dougall Avenue Public School (Windsor)",


		  "Dovercourt Public School (Toronto)",


		  "Doverwood Public School (Norfolk County)",


		  "Downie Central Public School (Innisfil)",


		  "Downsview Public School (Toronto)",


		  "Downtown Alternative School (Toronto)",


		  "Drayton Heights Public School (Mapleton)",


		  "Dr C F Cannon Public School (Oshawa)",


		  "Dr Charles Best Public School (Burlington)",


		  "Dr. David Suzuki Public School (Windsor)",


		  "Dr Emily Stowe School (Clarington)",


		  "Dresden Area Central School (Chatham-Kent)",


		  "Dr F J McDonald Catholic Elementary School (Ottawa)",


		  "Dr George Hall Public School (Greater Sudbury)",


		  "Dr G J MacGillivray Public School (Clarington)",


		  "Dr H D Taylor Public School (Windsor)",


		  "Driftwood Park Public School (Kitchener)",


		  "Driftwood Public School (Toronto)",


		  "Dr. J. Edgar Davey (New) Elementary Public School (Hamilton)",


		  "Dr John Seaton Senior Public School (Hamilton)",


		  "Dr MacDougall Public School (North Bay)",


		  "Dr Marion Hilliard Senior Public School (Toronto)",


		  "Dr M S Hawkins Senior School (Port Hope)",


		  "D. Roy Kennedy Public School (Ottawa)",


		  "Dr Roberta Bondar Public School (Ajax)",


		  "Dr Roberta Bondar Public School (Vaughan)",


		  "Dr Robert Thornton Public School (Whitby)",


		  "Dr Ross Tilley Public School (Clarington)",


		  "Dr S J Phillips Public School (Oshawa)",


		  "Drummond Central School (Perth)",


		  "DSBN Academy (Welland)",


		  "Dublin Heights Elementary and Middle School (Toronto)",


		  "Dufferin Elementary School (Owen Sound)",


		  "Dufferin Public School (Brantford)",


		  "Duffin's Bay Public School (Ajax)",


		  "Duke of Connaught Junior and Senior Public School (Toronto)",


		  "Duke of Edinburgh Public School (Oshawa)",


		  "Duncan J Schoular Public School (Smiths Falls)",


		  "Dundalk &amp; Proton Community School (Southgate)",


		  "Dundana Public School (Hamilton)",


		  "Dundas Central Public School (Hamilton)",


		  "Dundas Junior Public School (Toronto)",


		  "Dunlace Public School (Toronto)",


		  "Dunlop Public School (Ottawa)",


		  "Dunning-Foubert Elementary School (Ottawa)",


		  "Dunnville Central Public School (Haldimand)",


		  "Dunrankin Drive Public School (Mississauga)",


		  "Dunsford District Elementary School (Kawartha Lakes)",


		  "Duntroon Central Public School (Clearview)",


		  "Dunwich-Dutton Public School (Dutton/Dunwich)",


		  "Eagle Heights Public School (London)",


		  "Eagle Plains Public School (Brampton)",


		  "Eagle Ridge Public School (Ajax)",


		  "Ealing Public School (London)",


		  "Eamer's Corners Public School (Cornwall)",


		  "Ear Falls Public School (Ear Falls)",


		  "Earl A Fairman Public School (Whitby)",


		  "Earl Beatty Junior and Senior Public School (Toronto)",


		  "Earl Grey Senior Public School (Toronto)",


		  "Earl Haig Public School (Toronto)",


		  "Earl Kitchener Junior Public School (Hamilton)",


		  "Earl Prentice Public School (Marmora And Lake)",


		  "Earnscliffe Senior Public School (Brampton)",


		  "East Alternative School of Toronto (Toronto)",


		  "Eastbourne Drive Public School (Brampton)",


		  "Eastdale Public School (Hamilton)",


		  "Eastdale Public School (Woodstock)",


		  "East Front Public School (Cornwall)",


		  "East Garafraxa Central Public School (East Garafraxa)",


		  "East Lambton Elementary School (Warwick)",


		  "East Mersea Public School (Chatham-Kent)",


		  "Eastmount Park Junior Public School (Hamilton)",


		  "East Oro Public School (Oro-Medonte)",


		  "East Oxford Public School (Woodstock)",


		  "Eastview Public School (Oakville)",


		  "Eastview Public School (Toronto)",


		  "East View Public School (Sault Ste. Marie)",


		  "East Wawanosh Public School (North Huron)",


		  "East Williams Memorial Public School (North Middlesex)",


		  "Eastwood Public School (Windsor)",


		  "Eatonville Junior School (Toronto)",


		  "E C Drury/Trillium Demonstration School (Milton)",


		  "Echo Bay Central Public School (Macdonald, Meredith And Aberdeen Additional)",


		  "École Alliance St-Joseph (Greater Sudbury)",


		  "École Bishop Belleau - French Language Unit (Moosonee)",


		  "École catholique André-Cary (Kapuskasing)",


		  "École catholique Anicet-Morin (Timmins)",


		  "École catholique Assomption (Armstrong)",


		  "École catholique Assomption (Kirkland Lake)",


		  "École catholique de La Vérendrye (Thunder Bay)",


		  "École catholique de l'Enfant-Jésus (Dryden)",


		  "École catholique des Étoiles-du-Nord (Red Lake)",


		  "École catholique Don-Bosco (Timmins)",


		  "École catholique Franco-Supérieur (Thunder Bay)",


		  "École catholique Franco-Terrace (Terrace Bay)",


		  "École catholique Georges-Vanier (Smooth Rock Falls)",


		  "École catholique Immaculée-Conception (Black River-Matheson)",


		  "École catholique Jacques-Cartier (Timmins)",


		  "École catholique Jacques-Cartier (Kapuskasing)",


		  "École catholique Jeanne-Mance (Kapuskasing)",


		  "École catholique Jean-Vanier (Kirkland Lake)",


		  "École catholique Louis-Rhéaume (Timmins)",


		  "École catholique Nouveau Regard - Pavillon St-Joseph (Cochrane)",


		  "École catholique Pavillon Notre-Dame (Hearst)",


		  "École catholique Sacré-Coeur (Temiskaming Shores)",


		  "École catholique Sainte-Croix (Temiskaming Shores)",


		  "École catholique Sainte-Thérèse (Black River-Matheson)",


		  "École catholique Saint-Michel (Temiskaming Shores)",


		  "École catholique St-Antoine-de-Padoue (Opasatika)",


		  "École catholique St-Charles (Timmins)",


		  "École catholique St-Dominique (Timmins)",


		  "École catholique Ste-Anne (Hearst)",


		  "École catholique Ste-Rita (Val Rita-Harty)",


		  "École catholique St-François-Xavier (Mattice-Val Côté)",


		  "École catholique St-Gérard (Timmins)",


		  "École catholique St-Jude (Timmins)",


		  "École catholique St-Jules (Moonbeam)",


		  "École catholique St-Louis (Hearst)",


		  "École catholique St-Louis (Mcgarry)",


		  "École catholique Sts-Martyrs-Canadiens (Iroquois Falls)",


		  "École catholique Val-des-Bois (Marathon)",


		  "École élémentaire Antonine Maillet (Oshawa)",


		  "École élémentaire Carrefour des Jeunes (Brampton)",


		  "École élémentaire catholique Académie cath. Ange-Gabriel, pav. élé. (Brockville)",


		  "École élémentaire catholique Alain-Fortin (Ottawa)",


		  "École élémentaire catholique Arc-en-ciel (Ottawa)",


		  "École élémentaire catholique Bernard-Grandmaître (Ottawa)",


		  "École élémentaire catholique Curé-Labrosse (East Hawkesbury)",


		  "École élémentaire catholique de Casselman - Pav. St-Paul/Ste-Euphémie (Casselman)",


		  "École élémentaire catholique De la Découverte (Ottawa)",


		  "École élémentaire catholique de l'Ange-Gardien (South Glengarry)",


		  "École élémentaire catholique d'enseignement personnalisée - La Source (Ottawa)",


		  "École élémentaire catholique Des Pins (Ottawa)",


		  "École élémentaire catholique Des Pionniers (Ottawa)",


		  "École élémentaire catholique Des  Voyageurs (Ottawa)",


		  "École élémentaire catholique Du Rosaire (Clarence-Rockland)",


		  "École élémentaire catholique Edouard-Bond (Ottawa)",


		  "École élémentaire catholique Elda-Rouleau (North Glengarry)",


		  "École élémentaire catholique Elisabeth-Bruyère (Ottawa)",


		  "École élémentaire catholique Embrun - Pav. Saint-Jean/Pav. La Croisée (Russell)",


		  "École élémentaire catholique Frère André (London)",


		  "École élémentaire catholique Georges-Étienne-Cartier (Ottawa)",


		  "École élémentaire catholique Georges P Vanier (Windsor)",


		  "École élémentaire catholique Horizon-Jeunesse (Ottawa)",


		  "École élémentaire catholique Jeanne-Lajoie, pavillon élémentaire (Pembroke)",


		  "École élémentaire catholique Jean-Paul II (Ottawa)",


		  "École élémentaire catholique Jean-Paul II (Greater Sudbury)",


		  "École élémentaire catholique Jean-Robert-Gauthier (Ottawa)",


		  "École élémentaire catholique J.-L.-Couroux (Carleton Place)",


		  "École élémentaire catholique Kanata Nord (Ottawa)",


		  "École élémentaire catholique Lamoureux (Ottawa)",


		  "École élémentaire catholique La Source (North Stormont)",


		  "École élémentaire catholique Laurier-Carrière (North Glengarry)",


		  "École élémentaire catholique Laurier-Carrière (Ottawa)",


		  "École élémentaire catholique La Vérendrye (Ottawa)",


		  "École élémentaire catholique L'Envol (Quinte West)",


		  "École élémentaire catholique L'Étoile-de-l'Est (Ottawa)",


		  "École élémentaire catholique Marie-Tanguay (Cornwall)",


		  "École élémentaire catholique Marius-Barbeau (Ottawa)",


		  "École élémentaire catholique Mgr-Rémi-Gaulin (Kingston)",


		  "École élémentaire catholique Monseigneur Augustin Caron (Lasalle)",


		  "École élémentaire catholique Monseigneur-Bruyère (London)",


		  "École élémentaire catholique Monseigneur Jean Noël (Windsor)",


		  "École élémentaire catholique Montfort (Ottawa)",


		  "École élémentaire catholique Notre-Dame (Cornwall)",


		  "École élémentaire catholique Notre-Dame (Woodstock)",


		  "École élémentaire catholique Notre-Dame-du-Rosaire (North Stormont)",


		  "École élémentaire catholique Paul VI (Hawkesbury)",


		  "École élémentaire catholique Pavillon des Jeunes (Lakeshore)",


		  "École élémentaire catholique Pierre-Elliott-Trudeau (Ottawa)",


		  "École élémentaire catholique Reine-des-Bois (Ottawa)",


		  "École élémentaire catholique Roger-Saint-Denis (Ottawa)",


		  "École élémentaire catholique Sacré-Coeur (Clarence-Rockland)",


		  "École élémentaire catholique Saint-Albert (The Nation)",


		  "École élémentaire catholique Saint-Ambroise (Lakeshore)",


		  "École élémentaire catholique Saint-Antoine (Tecumseh)",


		  "École élémentaire catholique Sainte-Anne (Ottawa)",


		  "École élémentaire catholique Sainte-Bernadette (Ottawa)",


		  "École élémentaire catholique Sainte-Catherine (Chatham-Kent)",


		  "École élémentaire catholique Saint-Edmond (Windsor)",


		  "École élémentaire catholique Sainte-Félicité (Clarence-Rockland)",


		  "École élémentaire catholique Sainte-Geneviève (Ottawa)",


		  "École élémentaire catholique Sainte-Lucie (South Stormont)",


		  "École élémentaire catholique Sainte-Marguerite-Bourgeois (Hawkesbury)",


		  "École élémentaire catholique Sainte-Marguerite-Bourgeois (Merrickville-Wolford)",


		  "École élémentaire catholique Sainte-Marguerite-Bourgeoys (Woodstock)",


		  "École élémentaire catholique Sainte-Marie (Ottawa)",


		  "École élémentaire catholique Sainte-Marie (Chatham-Kent)",


		  "École élémentaire catholique Sainte-Thérèse (Cornwall)",


		  "École élémentaire catholique Sainte-Thérèse (Windsor)",


		  "École élémentaire catholique Sainte-Thérèse-d'Avila (Russell)",


		  "École élémentaire catholique Sainte-Trinité (Clarence-Rockland)",


		  "École élémentaire catholique Sainte-Ursule (Amherstburg)",


		  "École élémentaire catholique Saint-Francis (Chatham-Kent)",


		  "École élémentaire catholique Saint-François-d'Assise (Ottawa)",


		  "École élémentaire catholique Saint-François-Xavier (Sarnia)",


		  "École élémentaire catholique Saint-Gabriel (Cornwall)",


		  "École élémentaire catholique Saint-Grégoire (Champlain)",


		  "École élémentaire catholique Saint-Guillaume (Ottawa)",


		  "École élémentaire catholique Saint-Isidore (The Nation)",


		  "École élémentaire catholique Saint-Jean-Baptiste (Champlain)",


		  "École élémentaire catholique Saint-Jean-Baptiste (Amherstburg)",


		  "École élémentaire catholique Saint-Jean-de-Brébeuf (London)",


		  "École élémentaire catholique Saint-Joseph d'Orléans (Ottawa)",


		  "École élémentaire catholique Saint-Joseph (Lefaivre) (Alfred And Plantagenet)",


		  "École élémentaire catholique Saint-Joseph (Russell) (Russell)",


		  "École élémentaire catholique Saint-Joseph (Wendover) (Alfred And Plantagenet)",


		  "École élémentaire catholique Saint-Mathieu (Clarence-Rockland)",


		  "École élémentaire catholique Saint-Michel (Leamington)",


		  "École élémentaire catholique Saint-Paul (Alfred And Plantagenet)",


		  "École élémentaire catholique Saint-Paul (Pointe-Aux- Roches)",


		  "École élémentaire catholique Saint-Philippe (Chatham-Kent)",


		  "École élémentaire catholique Saint-Thomas-d'Aquin (Sarnia)",


		  "École élémentaire catholique Saint-Viateur (Russell)",


		  "École élémentaire catholique Saint-Victor (Alfred And Plantagenet)",


		  "École élémentaire catholique St-Dominique-Savio (Owen Sound)",


		  "École élémentaire catholique Ste-Jeanne-d'Arc (London)",


		  "École élémentaire catholique Ste-Marguerite-d'Youville (Tecumseh)",


		  "École élémentaire catholique St-Joseph (West Nipissing)",


		  "École élémentaire catholique Terre des Jeunes (Ottawa)",


		  "École élémentaire catholique Trillium (Chapleau)",


		  "École élémentaire Champlain (Welland)",


		  "École élémentaire Charles Sauriol (Toronto)",


		  "École élémentaire Confédération (Welland)",


		  "École élémentaire des Quatre-Rivières (Orangeville)",


		  "École élémentaire du Chêne (Oakville)",


		  "École élémentaire Étienne-Brûlé (Toronto)",


		  "École élémentaire Félix-Leclerc (Toronto)",


		  "École élémentaire Gabriel-Dumont (London)",


		  "École élémentaire Gabrielle-Roy (Toronto)",


		  "École élémentaire Georges-P-Vanier (Hamilton)",


		  "École élémentaire Horizon Jeunesse (Mississauga)",


		  "École élémentaire Jeanne-Lajoie (Toronto)",


		  "École élémentaire Jeunes sans frontières (Brampton)",


		  "École élémentaire L'Académie de la Seigneurie (Casselman)",


		  "École élémentaire La Fontaine (Vaughan)",


		  "École élémentaire LaMarsh (Niagara Falls)",


		  "École élémentaire La Mosaïque (Toronto)",


		  "École élémentaire La Source (Barrie)",


		  "École élémentaire Laure-Rièse (Toronto)",


		  "École élémentaire L'Envolée (Windsor)",


		  "École élémentaire Les Rapides (Sarnia)",


		  "École élémentaire L'Harmonie (Waterloo)",


		  "École élémentaire L'Héritage (St. Catharines)",


		  "École élémentaire L'Odyssée (Guelph)",


		  "École élémentaire Maison Montessori (Toronto)",


		  "École élémentaire Marie-Curie (London)",


		  "École élémentaire Michel-Gratton (Windsor)",


		  "École élémentaire Nouvel Horizon (Welland)",


		  "École élémentaire Patricia-Picknell (Oakville)",


		  "École élémentaire Pavillon de la jeunesse (Hamilton)",


		  "École élémentaire Pierre-Elliott-Trudeau (Toronto)",


		  "École élémentaire publique Carrefour Jeunesse (Clarence-Rockland)",


		  "École élémentaire publique Charlotte Lemieux (Ottawa)",


		  "École élémentaire publique Cité Jeunesse (Quinte West)",


		  "École élémentaire publique De la Rivière Castor (Russell)",


		  "École élémentaire publique De la Salle (Ottawa)",


		  "École élémentaire publique des Navigateurs (Temiskaming Shores)",


		  "École élémentaire publique Des Sentiers (Ottawa)",


		  "École élémentaire publique Francojeunesse (Ottawa)",


		  "École élémentaire publique Gabrielle-Roy (Ottawa)",


		  "École élémentaire publique Gisèle-Lalonde (Ottawa)",


		  "École élémentaire publique Hearst (Hearst)",


		  "École élémentaire publique Jeanne-Sauvé (Ottawa)",


		  "École élémentaire publique Kanata (Ottawa)",


		  "École élémentaire publique Le Prélude (Ottawa)",


		  "École élémentaire publique L'Équinoxe (Pembroke)",


		  "École élémentaire publique Le Sommet (Hawkesbury)",


		  "École élémentaire publique Le Trillium (Ottawa)",


		  "École élémentaire publique L'Héritage (Cornwall)",


		  "École élémentaire publique l'Odyssée (North Bay)",


		  "École élémentaire publique L'Odyssée (Ottawa)",


		  "École élémentaire publique Louis-Riel (Ottawa)",


		  "École élémentaire publique Madeleine-de-Roybon (Kingston)",


		  "École élémentaire publique Marc-Garneau (Quinte West)",


		  "École élémentaire publique Marie-Curie (Ottawa)",


		  "École élémentaire publique Maurice-Lapointe (Ottawa)",


		  "École élémentaire publique Michaëlle-Jean (Ottawa)",


		  "École élémentaire publique Mille-Iles (Kingston)",


		  "École élémentaire publique Nouvel Horizon (Hawkesbury)",


		  "École élémentaire publique Omer-Deslauriers (Ottawa)",


		  "École élémentaire publique Rose des Vents (Cornwall)",


		  "École élémentaire publique Séraphin-Marion (Ottawa)",


		  "École élémentaire publique Terre des Jeunes (North Glengarry)",


		  "École élémentaire publique Trille des Bois (Ottawa)",


		  "École élémentaire Renaissance (Burlington)",


		  "École élémentaire Roméo Dallaire (Barrie)",


		  "École élémentaire Scarborough Sud ()",


		  "Ecole Gron Morgan Public School (Thunder Bay)",


		  "École Hillcrest Public School (Petrolia)",


		  "École Immaculée-Conception (Ignace)",


		  "École intermédiaire Académie cath. Ange-Gabriel 7e-8e (Brockville)",


		  "École intermédiaire Béatrice-Desloges 7e-8e (Ottawa)",


		  "École intermédiaire catholique La Citadelle (Cornwall)",


		  "École intermédiaire catholique - Pavillon Casselman (Casselman)",


		  "École intermédiaire catholique - Pavillon Embrun (Russell)",


		  "École intermédiaire catholique - Pavillon Hawkesbury (Hawkesbury)",


		  "École intermédiaire catholique - Pavillon Plantagenet (Alfred And Plantagenet)",


		  "École intermédiaire catholique - Pavillon Rockland (Clarence-Rockland)",


		  "École intermédiaire Catholique Sacré-Coeur (Timmins)",


		  "École intermédiaire Franco-Cité 7e-8e (Ottawa)",


		  "École intermédiaire Franco-Ouest 7e-8e (Ottawa)",


		  "École intermédiaire Garmeau 7e-8e (Ottawa)",


		  "École intermédiaire Jeanne-Lajoie 7e-8e (Pembroke)",


		  "École intermédiaire L'Équinoxe (Pembroke)",


		  "École intermédiaire Marie-Rivier7e-8e (Kingston)",


		  "École intermédiaire Pierre-Savard 7e-8e (Ottawa)",


		  "École intermédiaire Samuel-Genest 7e-8e (Ottawa)",


		  "Ecole Lundy's Lane School (Kingston)",


		  "École Notre-Dame-de-Fatima (Greenstone)",


		  "École Notre-Dame-du-Sault (Sault Ste. Marie)",


		  "École publique Camille-Perron (Markstay-Warren)",


		  "École publique de la Découverte (Greater Sudbury)",


		  "École publique de la Rivière-des-Français (French River)",


		  "École publique Étoile du Nord (Iroquois Falls)",


		  "École publique Foyer-Jeunesse (Greater Sudbury)",


		  "École publique Franco-Manitou (Manitouwadge)",


		  "École publique Franco-Nord (Greater Sudbury)",


		  "École publique Hanmer (Greater Sudbury)",


		  "École publique Hélène-Gravel (Greater Sudbury)",


		  "École publique Héritage (North Bay)",


		  "École publique Jean-Éthier-Blais (Greater Sudbury)",


		  "École publique Jeanne-Sauvé (Greater Sudbury)",


		  "École publique Jeunesse-Active (West Nipissing)",


		  "École publique Le Coeur du Nord (Kapuskasing)",


		  "École publique l'Escalade (Wawa)",


		  "École publique Lionel-Gauthier (Timmins)",


		  "École publique Macdonald-Cartier (Greater Sudbury)",


		  "École publique Pavillon-de-l'Avenir (Greater Sudbury)",


		  "École publique Pavillon Renaissance (Timmins)",


		  "École publique Saint-Joseph (Penetanguishene)",


		  "École publique Villa Française des Jeunes (Elliot Lake)",


		  "École Saint-Joseph (Wawa)",


		  "École Saint Nom de Jésus (Hornepayne)",


		  "École Saint-Raymond (North Bay)",


		  "École secondaire catholique Algonquin (North Bay)",


		  "École séparée Christ-Roi (West Nipissing)",


		  "École séparée élémentaire l'Horizon (Greater Sudbury)",


		  "École séparée Félix-Ricard (Greater Sudbury)",


		  "École séparée Georges-Vanier (Elliot Lake)",


		  "École séparée La Résurrection (West Nipissing)",


		  "École séparée Lorrain (Bonfield)",


		  "École séparée Mariale (Thorne)",


		  "École séparée Notre-Dame (Greater Sudbury)",


		  "École séparée Notre-Dame (Foleyet)",


		  "École séparée Notre-Dame-de-la-Merci (Greater Sudbury)",


		  "École séparée Notre-Dame-du-Rosaire (Gogama)",


		  "École séparée Sacré-Coeur (Chapleau)",


		  "École séparée Saint-Antoine (French River)",


		  "École séparée Saint-Augustin (Greater Sudbury)",


		  "École séparée Saint-Charles-Borromée (St.-Charles)",


		  "École séparée Saint-Denis (Greater Sudbury)",


		  "École séparée Saint-Dominique (Greater Sudbury)",


		  "École séparée Sainte-Anne (Mattawa)",


		  "École séparée Sainte-Anne (Spanish)",


		  "École séparée Sainte-Anne (North Bay)",


		  "École séparée Sainte-Marie (Greater Sudbury)",


		  "École séparée Sainte-Thérèse (Greater Sudbury)",


		  "École séparée Saint-Joseph (Greater Sudbury)",


		  "École séparée Saint-Joseph (Blind River)",


		  "École séparée Saint-Joseph (Dubreuilville)",


		  "École séparée Saint-Joseph (Espanola)",


		  "École séparée Saint-Paul (Greater Sudbury)",


		  "École séparée Saint-Paul (North Bay)",


		  "École séparée Saint-Pierre (Greater Sudbury)",


		  "École séparée Saint-Thomas (Markstay-Warren)",


		  "École séparée Saint-Thomas-D'Aquin (East Ferris)",


		  "École séparée Saint-Vincent (North Bay)",


		  "École séparée Ste-Marguerite-d'Youville (West Nipissing)",


		  "École séparée St-Étienne (Greater Sudbury)",


		  "École séparée St-Joseph (Greater Sudbury)",


		  "École Ste Marguerite Bourgeoys (Kenora)",


		  "École St-Joseph (Greenstone)",


		  "Edenbrook Hill Public School (Brampton)",


		  "Edenrose Public School (Mississauga)",


		  "Edenwood Middle School (Mississauga)",


		  "Edgewater Park Public School (Thunder Bay)",


		  "Edgewood Public School (Toronto)",


		  "Edith Cavell Public School (St. Catharines)",


		  "Edmison Heights Public School (Peterborough)",


		  "Edna Staebler Public School (Waterloo)",


		  "Edward Johnson Public School (Guelph)",


		  "ÉÉC Ange-Gabriel (Mississauga)",


		  "ÉÉC Cardinal-Léger (Kitchener)",


		  "ÉÉC Corpus-Christi (Oshawa)",


		  "ÉÉC du Sacré-Coeur-Georgetown (Halton Hills)",


		  "ÉÉC du Sacré-Coeur-Toronto (Toronto)",


		  "ÉÉC du Sacré-Coeur-Welland (Welland)",


		  "ÉÉC Frère-André (Barrie)",


		  "ÉÉC Georges-Étienne-Cartier (Toronto)",


		  "ÉÉC Immaculée-Conception (St. Catharines)",


		  "ÉÉC Jean-Paul II (Whitby)",


		  "ÉÉC Le-Petit-Prince (Vaughan)",


		  "ÉÉC Marguerite-Bourgeois-Borden (Essa)",


		  "ÉÉC Mère-Élisabeth-Bruyère (Waterloo)",


		  "ÉÉC Monseigneur-de-Laval (Hamilton)",


		  "ÉÉC Monseigneur-Jamot (Peterborough)",


		  "ÉÉC Notre-Dame (Hamilton)",


		  "ÉÉC Notre-Dame-de-la-Jeunesse-Ajax (Ajax)",


		  "ÉÉC Notre-Dame-de-la-Jeunesse-Niagara.F (Niagara Falls)",


		  "ÉÉC Notre-Dame-des-Champs (Ottawa)",


		  "ÉÉC René-Lamoureux (Mississauga)",


		  "ÉÉC Saint-Antoine (Niagara Falls)",


		  "ÉÉC Saint-Denis (Greater Sudbury)",


		  "ÉÉC Sainte-Croix (Tiny)",


		  "ÉÉC Sainte-Jeanne-d'Arc (Brampton)",


		  "ÉÉC Sainte-Madeleine (Toronto)",


		  "ÉÉC Sainte-Marguerite-Bourgeoys-Brantfrd (Brantford)",


		  "ÉÉC Sainte-Marguerite-Bourgeoys-Markham (Markham)",


		  "ÉÉC Sainte-Marguerite-Bourgeoys-St.Cath (St. Catharines)",


		  "ÉÉC Sainte-Marguerite-d'Youville (Toronto)",


		  "ÉÉC Sainte-Marie-Oakville (Oakville)",


		  "ÉÉC Sainte-Marie-Simcoe (Norfolk County)",


		  "ÉÉC Saint-François-d'Assise (Welland)",


		  "ÉÉC Saint-Jean (Aurora)",


		  "ÉÉC Saint-Jean-Baptiste (Mississauga)",


		  "ÉÉC Saint-Jean-de-Lalande (Toronto)",


		  "ÉÉC Saint-Joseph (Port Colborne)",


		  "ÉÉC Saint-Louis (Penetanguishene)",


		  "ÉÉC Saint-Michel (TORONTO)",


		  "ÉÉC Saint-Nicolas (Milton)",


		  "ÉÉC Saint-Noël-Chabanel-Cambridge (Cambridge)",


		  "ÉÉC Saint-Noël-Chabanel-Toronto (Toronto)",


		  "ÉÉC Saint-Philippe (Burlington)",


		  "ÉÉC Saint-René-Goupil (Guelph)",


		  "ÉÉC Samuel-de-Champlain (Orillia)",


		  "Eganville &amp; District Public School (Bonnechere Valley)",


		  "Eglinton Junior Public School (Toronto)",


		  "Egremont Community School (Southgate)",


		  "ÉIC Jean-Vanier (Welland)",


		  "ÉIC Monseigneur-de-Charbonnel (Toronto)",


		  "ÉIC Nouvelle-Alliance (Barrie)",


		  "ÉIC Père-René-de-Galinée (Cambridge)",


		  "ÉIC Renaissance (Aurora)",


		  "ÉIC Saint-Charles-Garnier (Whitby)",


		  "ÉIC Sainte-Famille (Mississauga)",


		  "E I McCulley Public School (St. Catharines)",


		  "E J James Public School (Oakville)",


		  "E J Sand Public School (Thornhill)",


		  "Ekcoe Central School (Southwest Middlesex)",


		  "Elder's Mills Public School (Vaughan)",


		  "Elgin Avenue Public School (Norfolk)",


		  "Elginburg Public School (Kingston)",


		  "Elgin Court Public School (St. Thomas)",


		  "Elgin Market Public School (Kincardine)",


		  "Elgin Street Public School (Cambridge)",


		  "Elgin Street Public School (Ottawa)",


		  "Elia Middle School (Toronto)",


		  "Elizabeth Bagshaw School (Hamilton)",


		  "Elizabeth B Phin Public School (Pickering)",


		  "Elizabeth Park Public School (Ottawa)",


		  "Elizabeth Simcoe Junior Public School (Toronto)",


		  "Elizabeth Ziegler Public School (Waterloo)",


		  "Elkhorn Public School (Toronto)",


		  "Elk Lake Public School (James)",


		  "Ellen Fairclough Public School (Markham)",


		  "Ellengale Public School (Mississauga)",


		  "Ellesmere-Statton Public School (Toronto)",


		  "Ellwood Memorial Public School (Caledon)",


		  "Elma Township Public School (North Perth)",


		  "Elmbank Junior Middle Academy (Toronto)",


		  "Elmcrest Public School (Mississauga)",


		  "Elmdale Public School (Ottawa)",


		  "Elmlea Junior School (Toronto)",


		  "Elora Public School (Centre Wellington)",


		  "Emily Carr Middle School (Ottawa)",


		  "Emily Carr Public School (London)",


		  "Emily Carr Public School (Oakville)",


		  "Emily Carr Public School (Toronto)",


		  "Emma King Elementary School (Barrie)",


		  "Empire Public School (Waterloo)",


		  "Englehart Public School (Englehart)",


		  "English Catholic Central School (Temiskaming Shores)",


		  "Enniskillen Public School (Clarington)",


		  "Enterprise Public School (Stone Mills)",


		  "Epiphany of our Lord Catholic Academy (Toronto)",


		  "Epsom Public School (Scugog)",


		  "Equinox Holistic Alternative School (Toronto)",


		  "Eramosa Public School (Guelph/Eramosa)",


		  "Erin Centre Middle School (Mississauga)",


		  "Erin Mills Middle School (Mississauga)",


		  "Erin Public School (Erin)",


		  "Ernest C Drury Provincial School for (Milton)",


		  "Ernest Cumberland Elementary School (New Tecumseth)",


		  "Ernest Public School (Toronto)",


		  "Ernie Checkeris Public School (Greater Sudbury)",


		  "Errol Road Public School (Sarnia)",


		  "Errol Village Public School (Plympton-Wyoming)",


		  "Escarpment View Public School (Milton)",


		  "Esker Lake Public School (Brampton)",


		  "Essex Junior and Senior Public School (Toronto)",


		  "Essex Public School (Essex)",


		  "Esten Park Public School (Elliot Lake)",


		  "E T Carmichael Public School (North Bay)",


		  "E T Crowle Public School (Markham)",


		  "Étienne Brûlé Junior School (Toronto)",


		  "Etienne Brule Public School (Sault Ste. Marie)",


		  "Evelyn Harrison Public School (London)",


		  "Evergreen Heights Education Centre (Perry)",


		  "Evergreen Public School (Kenora)",


		  "E W Farr Memorial Public School (Pelham)",


		  "E W Foster School (Milton)",


		  "E W Norman Public School (North Bay)",


		  "Exeter Public School (South Huron)",


		  "Fairbank Memorial Community School (Toronto)",


		  "Fairbank Middle School (Toronto)",


		  "Fairfield Elementary School (Loyalist)",


		  "Fairglen Junior Public School (Toronto)",


		  "Fairmont Public School (London)",


		  "Fairmount Public School (Toronto)",


		  "Fairport Beach Public School (Pickering)",


		  "Fairview Avenue Public School (Haldimand)",


		  "Fairview Public School (Mississauga)",


		  "Fairview School (Brantford)",


		  "Fairwind Senior Public School (Mississauga)",


		  "Fairwood Public School (Georgina)",


		  "Falgarwood Public School (Oakville)",


		  "Fallingbrook Community Elementary School (Ottawa)",


		  "Fallingbrook Middle School (Mississauga)",


		  "Fallingbrook Public School (Whitby)",


		  "Fallingdale Public School (Brampton)",


		  "Farley Mowat Public School (Ottawa)",


		  "Father Clair Tipping School (Brampton)",


		  "Father C W Sullivan Catholic School (Brampton)",


		  "Father Daniel Zanon Elementary School (Mississauga)",


		  "Father Francis McSpiritt Catholic Elementary School (Brampton)",


		  "Father Frederick McGinn Catholic Elementary School (Richmond Hill)",


		  "Father F X O'Reilly School (New Tecumseth)",


		  "Father Hennepin Catholic Elementary School (Niagara Falls)",


		  "Father Henri J M Nouwen Catholic Elementary School (Richmond Hill)",


		  "Father John Kelly Catholic Elementary School (Vaughan)",


		  "Father Joseph Venini Catholic School (Oshawa)",


		  "Father Serra Catholic School (Toronto)",


		  "Faywood Arts-Based Curriculum School (Toronto)",


		  "Featherston Drive Public School (Ottawa)",


		  "Federal Public School (Kirkland Lake)",


		  "Fenelon Twp Public School (Kawartha Lakes)",


		  "Fenside Public School (Toronto)",


		  "Fern Avenue Junior and Senior Public School (Toronto)",


		  "Ferndale Public School (St. Catharines)",


		  "Ferndale Woods Elementary School (Barrie)",


		  "Fernforest Public School (Brampton)",


		  "Ferris Glen Public School (East Ferris)",


		  "Fessenden School (Hamilton)",


		  "F H Miller Junior Public School (Toronto)",


		  "Fieldcrest Elementary School (Bradford West Gwillimbury)",


		  "Fielding Drive Public School (Ottawa)",


		  "Finch Public School (Toronto)",


		  "Firgrove Public School (Toronto)",


		  "First Avenue Public School (Kingston)",


		  "First Avenue Public School (Ottawa)",


		  "First Nations School of Toronto (Toronto)",


		  "Fisher Park/Summit AS Public School (Ottawa)",


		  "Fisherville Senior Public School (Toronto)",


		  "Fitch Street Public School (Welland)",


		  "Five Mile Public School (Thunder Bay)",


		  "F J Rutland Public School (Niagara Falls)",


		  "Flamborough Centre School (Hamilton)",


		  "Fleming Public School (Toronto)",


		  "Flemington Public School (Toronto)",


		  "Fletcher's Creek Senior Public School (Brampton)",


		  "Fletcher's Creek South Jr. PS (Brampton)",


		  "Floradale Public School (Mississauga)",


		  "Floradale Public School (Woolwich)",


		  "Florence Meares Public School (Burlington)",


		  "Foley Catholic School (Ramara)",


		  "Foleyet Public School (Foleyet)",


		  "Folkstone Public School (Brampton)",


		  "Forest Avenue Public School (Mississauga)",


		  "Forest Glade Public School (Windsor)",


		  "Forest Glen Public School (Mississauga)",


		  "Forest Glen Public School (Wilmot)",


		  "Forest Hill Junior and Senior Public School (Toronto)",


		  "Forest Hill Public School (Kitchener)",


		  "Forest Hill Public School (Springwater)",


		  "Forest Manor Public School (Toronto)",


		  "Forest Park Public School (St. Thomas)",


		  "Forest Run Elementary School (Vaughan)",


		  "Forest Trail Public School (Elementary) (Oakville)",


		  "Forest Valley Elementary School (Ottawa)",


		  "Forestview Public School (Niagara Falls)",


		  "Fort Erie Public School (Fort Erie)",


		  "Fossil Hill Public School (Vaughan)",


		  "Foxboro Public School (Belleville)",


		  "Francis H Clergue Public School (Sault Ste. Marie)",


		  "Francis Libermann Catholic Elementary School (Toronto)",


		  "Frankford Public School (Quinte West)",


		  "Frankland Community School (Toronto)",


		  "Franklin D Roosevelt Public School (London)",


		  "Franklin Junior Public School (Hamilton)",


		  "Franklin Public School (Kitchener)",


		  "Franklin Street Public School (Markham)",


		  "Frank P Krznaric Whitney Public School (Timmins)",


		  "Frank Ryan Catholic Senior Elementary School (Ottawa)",


		  "Frank W Begley Public School (Windsor)",


		  "Fred A Hamilton Public School (Guelph)",


		  "Fred C Cook Public School (Bradford West Gwillimbury)",


		  "Frenchman's Bay Public School (Pickering)",


		  "Frontenac Public School (Burlington)",


		  "Frontenac Public School (Kingston)",


		  "Front of Yonge Elementary School (Front Of Yonge)",


		  "Gainsborough Central Public School (West Lincoln)",


		  "Galloway Road Public School (Toronto)",


		  "Gananoque Intermediate School (Gananoque)",


		  "Ganaraska Trail Public School (Port Hope)",


		  "Gandatsetiagon Public School (Pickering)",


		  "Garden Avenue Junior Public School (Toronto)",


		  "Gardiner Public School (Halton Hills)",


		  "Garrison Road Public School (Fort Erie)",


		  "Garthwood Park Public School (Mississauga)",


		  "Gatchell Sch for Students with Special (Greater Sudbury)",


		  "Gatestone Elementary Public School (Hamilton)",


		  "Gateway Drive Public School (Guelph)",


		  "Gateway Public School (Toronto)",


		  "G C Huston Public School (Saugeen Shores)",


		  "GDCI - Elementary (Goderich)",


		  "General Brock Public School (Toronto)",


		  "General Brock Public School (Windsor)",


		  "General Crerar Public School (Toronto)",


		  "General Lake Public School (Petawawa)",


		  "General Mercer Junior Public School (Toronto)",


		  "General Vanier Public School (Ottawa)",


		  "General Vanier Public School (Fort Erie)",


		  "George Anderson Public School (Toronto)",


		  "George B Little Public School (Toronto)",


		  "George Hamilton Public School (Port Hope)",


		  "George Kennedy Public School (Halton Hills)",


		  "George L Armstrong Public School (Hamilton)",


		  "George O'Neill Public School (Nipigon)",


		  "George Peck Public School (Toronto)",


		  "George P Mackie Junior Public School (Toronto)",


		  "George R Allan Public School (Hamilton)",


		  "George R Gauld Junior School (Toronto)",


		  "Georges P Vanier Catholic School (Chatham-Kent)",


		  "George Street Public School (Aurora)",


		  "Georges Vanier Catholic Elementary School (Ottawa)",


		  "Georges Vanier Catholic School (Belleville)",


		  "Georges Vanier Catholic School (Brampton)",


		  "George Syme Community School (Toronto)",


		  "George Vanier Separate School (Madawaska Valley)",


		  "George Webster Elementary School (Toronto)",


		  "German Mills Public School (Thornhill)",


		  "Gertrude Colpus Public School (Oshawa)",


		  "Givins/Shaw Junior Public School (Toronto)",


		  "Glad Park Public School (Whitchurch-Stouffville)",


		  "Gladstone Public School (Cornwall)",


		  "Gladys Speers Public School (Oakville)",


		  "Glamorgan Junior Public School (Toronto)",


		  "Glashan Public School (Ottawa)",


		  "Gledhill Junior Public School (Toronto)",


		  "Glen Ames Senior Public School (Toronto)",


		  "Glen Brae Middle School (Hamilton)",


		  "Glenburnie Public School (Kingston)",


		  "Glencairn Public School (Kitchener)",


		  "Glen Cairn Public School (London)",


		  "Glen Cairn Public School (Ottawa)",


		  "Glen Cedar Public School (Newmarket)",


		  "Glendale Public School (Welland)",


		  "Glendale Public School (Brampton)",


		  "Glen Dhu Public School (Whitby)",


		  "Glen Echo Junior Public School (Hamilton)",


		  "Glengarry Intermediate School (North Glengarry)",


		  "Glengrove Public School (Pickering)",


		  "Glenhaven Senior Public School (Mississauga)",


		  "Glen Morris Central Public School (Brant)",


		  "Glenn Gould Public School (Vaughan)",


		  "Glen Ogilvie Public School (Ottawa)",


		  "Glen Orchard/Honey Harbour Public School (Muskoka Lakes)",


		  "Glen Park Public School (Toronto)",


		  "Glen Ravine Junior Public School (Toronto)",


		  "Glen Ridge Public School (St. Catharines)",


		  "Glen Shields (Vaughan)",


		  "Glen Street Public School (Oshawa)",


		  "Glen Tay Public School (Perth)",


		  "Glenview Public School (Burlington)",


		  "Glenview Senior Public School (Toronto)",


		  "Glen Williams Public School (Halton Hills)",


		  "Glenwood Public School (Windsor)",


		  "Glenwood Special Day School (Hamilton)",


		  "Glynn A Green Public School (Pelham)",


		  "Goderich Public School (Goderich)",


		  "Gogama Public School (Gogama)",


		  "Goldcrest Public School (Brampton)",


		  "Golden Avenue Public School (Timmins)",


		  "Golden Learning Centre (Red Lake)",


		  "Golf Road Junior Public School (Toronto)",


		  "Goodfellow Public School (Innisfil)",


		  "Good Shepherd Catholic Elementary School (Clarington)",


		  "Good Shepherd Catholic Elementary School (East Gwillimbury)",


		  "Good Shepherd Catholic Elementary School (Brampton)",


		  "Good Shepherd Catholic School (Scugog)",


		  "Good Shepherd Catholic School (Chatham-Kent)",


		  "Good Shepherd Elementary School (Ottawa)",


		  "Goodwood Public School (Uxbridge)",


		  "Gordon A Brown Middle School (Toronto)",


		  "Gordon B Attersley Public School (Oshawa)",


		  "Gordon Graydon Senior Public School (Brampton)",


		  "Gordon McGregor Public School (Windsor)",


		  "Gordon Price School (Hamilton)",


		  "Gordon Public School (Welland)",


		  "Gore Hill Public School (Leamington)",


		  "Gorham and Ware Community Public School (Gorham)",


		  "Gosfield North Public School (Kingsville)",


		  "Gosford Public School (Toronto)",


		  "Goulbourn Middle School (Ottawa)",


		  "Gracedale Public School (Toronto)",


		  "Gracefield Public School (St. Catharines)",


		  "Gracefield Public School (Toronto)",


		  "Grafton Public School (Alnwick/Haldimand)",


		  "Graham Bell-Victoria Public School (Brantford)",


		  "Grand Avenue Public School (Grimsby)",


		  "Grand Bend Public School (Lambton Shores)",


		  "Grand Valley &amp; District Public School (East Luther Grand Valley)",


		  "Grandview Central Public School (Haldimand)",


		  "Grandview Public School (Brantford)",


		  "Grandview Public School (Kawartha Lakes)",


		  "Grandview Public School (Oshawa)",


		  "Grandview Public School (Wilmot)",


		  "Grand View Public School (Cambridge)",


		  "Grand View Public School (Sault Ste. Marie)",


		  "Grant Alternative School (Ottawa)",


		  "Grant Sine Public School (Cobourg)",


		  "Grapeview Public School (St. Catharines)",


		  "Gravenhurst Public School (Gravenhurst)",


		  "Great Lakes Public School (Brampton)",


		  "Greely Elementary School (Ottawa)",


		  "Green Acres School (Hamilton)",


		  "Greenbank Middle School (Ottawa)",


		  "Greenbank Public School (Scugog)",


		  "Greenbriar Senior Public School (Brampton)",


		  "Greenbrier Public School (Brantford)",


		  "Greendale Public School (Niagara Falls)",


		  "Green Glade Senior Public School (Mississauga)",


		  "Greenholme Junior Middle School (Toronto)",


		  "Greenland Public School (Toronto)",


		  "Greensborough Public School (Markham)",


		  "Greensville Public School (Hamilton)",


		  "Greenwood Public School (Sault Ste. Marie)",


		  "Gregory A Hogan Catholic School (Sarnia)",


		  "Gregory Drive Public School (Chatham-Kent)",


		  "Grenoble Public School (Brampton)",


		  "Grenoble Public School (Toronto)",


		  "Grey Central Public School (Huron East)",


		  "Grey Owl Junior Public School (Toronto)",


		  "Guardian Angels Catholic Elementary School (Brampton)",


		  "Guardian Angels Catholic Elementary School (Milton)",


		  "Guardian Angels Elementary School (Hamilton)",


		  "Guardian Angels Elementary School (Ottawa)",


		  "Guardian Angels' School (Orillia)",


		  "Guildwood Junior Public School (Toronto)",


		  "Gulfstream Public School (Toronto)",


		  "Guthrie Public School (Oro-Medonte)",


		  "Guy B Brown Elementary Public School (Hamilton)",


		  "Hagersville Elementary School (Haldimand County)",


		  "H A Halbert Junior Public School (Toronto)",


		  "Haileybury Public School (Temiskaming Shores)",


		  "Hamlet Public School (Stratford)",


		  "Hampton Junior Public School (Clarington)",


		  "Hanna Memorial Public School (Sarnia)",


		  "Hanover Heights Community School (Hanover)",


		  "Hanover Public School (Brampton)",


		  "Harmony Heights Public School (Oshawa)",


		  "Harmony Public School (Belleville)",


		  "Harmony Public School (Oshawa)",


		  "Harold F Loughin Public School (Brampton)",


		  "Harold Longworth Public School (Clarington)",


		  "Harriett Todd Public School (Orillia)",


		  "Harrisfield Public School (Ingersoll)",


		  "Harrison Public School (Halton Hills)",


		  "Harrison Public School (Toronto)",


		  "Harrow Public School (Essex)",


		  "Harrow Senior Public School (Essex)",


		  "Harrowsmith Public School (South Frontenac)",


		  "Harry Bowes Public School (Whitchurch-Stouffville)",


		  "Harry J Clarke Public School (Belleville)",


		  "Hartman Public School (Aurora)",


		  "Harwich-Raleigh Public School (Chatham-Kent)",


		  "Harwood Public School (Toronto)",


		  "Hastings Public School (Trent Hills)",


		  "Havelock-Belmont Public School (Havenlock-Belmont-Methuen)",


		  "Hawthorne II Bilingual Alternative Junior School (Toronto)",


		  "Hawthorne Public School (Ottawa)",


		  "Hawthorne Village Public School (Milton)",


		  "Hawthorn Public School (Mississauga)",


		  "Hazel McCallion Senior Public School (Mississauga)",


		  "Heather Heights Junior Public School (Toronto)",


		  "Helen Detwiler Junior Elementary School (Hamilton)",


		  "Helen Wilson Public School (Brampton)",


		  "Henderson Avenue Public School (Thornhill)",


		  "Henry Hudson Senior Public School (Toronto)",


		  "Henry Kelsey Senior Public School (Toronto)",


		  "Henry Larsen Elementary School (Ottawa)",


		  "Henry Munro Middle School (Ottawa)",


		  "Hensall Public School (Bluewater)",


		  "Hepworth Central Public School (South Bruce Peninsula)",


		  "Herb Campbell Public School (Caledon)",


		  "Herbert H Carnegie Public School (Vaughan)",


		  "Heritage Glen Public School (Oakville)",


		  "Heritage Park Public School (Toronto)",


		  "Heritage Public School (Ottawa)",


		  "Herman Street Public School (Petawawa)",


		  "Hermon Public School (Bancroft)",


		  "Heron Park Junior Public School (Toronto)",


		  "Hespeler Public School (Cambridge)",


		  "Hess Street Junior Public School (Hamilton)",


		  "Hewitt's Creek Public School (Barrie)",


		  "Hewson Elementary Public School (Brampton)",


		  "Heximer Avenue Public School (Niagara Falls)",


		  "H G Bernard Public School (Richmond Hill)",


		  "H H Langford Public School (Greater Napanee)",


		  "Hickory Wood Public School (Brampton)",


		  "Hickson Central Public School (East Zorra-Tavistock)",


		  "Highbush Public School (Pickering)",


		  "Highcastle Public School (Toronto)",


		  "Highfield Junior School (Toronto)",


		  "Highgate Public School (Markham)",


		  "Highland Creek Public School (Toronto)",


		  "Highland Heights Junior Public School (Toronto)",


		  "Highland Heights Public School (Peterborough)",


		  "Highland Junior High School (Toronto)",


		  "Highland Public School (Cambridge)",


		  "High Park Alternative School Junior (Toronto)",


		  "High Park Public School (Sarnia)",


		  "Highpoint Community Elementary School (Southgate)",


		  "Highview Public School (Aurora)",


		  "Highview Public School (Pembroke)",


		  "Highview Public School (Toronto)",


		  "Highview Public School (Hamilton)",


		  "Hillcrest Central School (South Bruce)",


		  "Hillcrest Community School (Toronto)",


		  "Hillcrest Elementary Public School (Hamilton)",


		  "Hillcrest Elementary School (Owen Sound)",


		  "Hillcrest Public School (Trent Hills)",


		  "Hillcrest Public School (Cambridge)",


		  "Hillcrest Public School (Mississauga)",


		  "Hillcrest Public School (London)",


		  "Hillcrest Public School (Belleville)",


		  "Hillcrest Public School (Barrie)",


		  "Hilldale Public School (Brampton)",


		  "Hillmount Public School (Toronto)",


		  "Hillsdale Elementary School (Springwater)",


		  "Hillsdale Public School (Oshawa)",


		  "Hillside Senior Public School (Mississauga)",


		  "Hilltop Middle School (Toronto)",


		  "Hilson Avenue Public School (Ottawa)",


		  "Hinchinbrooke Public School (Central Frontenac)",


		  "H J Alexander Community School (Toronto)",


		  "H J Lassaline Catholic School (Windsor)",


		  "H M Robbins Public School (Sault Ste. Marie)",


		  "Hodgson Senior Public School (Toronto)",


		  "Holbrook Junior Public School (Hamilton)",


		  "Holland-Chatsworth Central School (Chatsworth)",


		  "Holland Landing Public School (East Gwillimbury)",


		  "Hollycrest Middle School (Toronto)",


		  "Holly Meadows Elementary School (Barrie)",


		  "Hollywood Public School (Toronto)",


		  "Holmesville Public School (Central Huron)",


		  "Holy Angels Catholic School (Toronto)",


		  "Holy Angels Separate School (Schreiber)",


		  "Holy Child Catholic Catholic School (Toronto)",


		  "Holy Cross Catholic Elementary School (Lasalle)",


		  "Holy Cross Catholic Elementary School (Thunder Bay)",


		  "Holy Cross Catholic School (Halton Hills)",


		  "Holy Cross Catholic School (Toronto)",


		  "Holy Cross Catholic School (Innisfil)",


		  "Holy Cross Catholic School School (Greater Sudbury)",


		  "Holy Cross Elementary School (Ottawa)",


		  "Holy Cross School (Brantford)",


		  "Holy Cross School (North Grenville)",


		  "Holy Cross School (Mississauga)",


		  "Holy Cross Separate School (London)",


		  "Holy Family (Hanover)",


		  "Holy Family Catholic Elementary School (Thunder Bay)",


		  "Holy Family Catholic Elementary School (Thornhill)",


		  "Holy Family Catholic Elementary School (Wilmot)",


		  "Holy Family Catholic Elementary School (Clarington)",


		  "Holy Family Catholic School (Chatham-Kent)",


		  "Holy Family Catholic School (Toronto)",


		  "Holy Family Catholic School (Brock)",


		  "Holy Family Catholic School (Kingston)",


		  "Holy Family Catholic School (Sault Ste. Marie)",


		  "Holy Family Elementary School (London)",


		  "Holy Family Elementary School (Ottawa)",


		  "Holy Family French Immersion School (Woodstock)",


		  "Holy Family School (Caledon)",


		  "Holy Family School (Englehart)",


		  "Holy Family School (Brant)",


		  "Holy Family School (Oakville)",


		  "Holy Family School (New Tecumseth)",


		  "Holy Jubilee Catholic Elementary School (Vaughan)",


		  "Holy Name Catholic Elementary School (Welland)",


		  "Holy Name Catholic Elementary School (King)",


		  "Holy Name Catholic School (Toronto)",


		  "Holy Name Catholic School (Essex)",


		  "Holy Name Catholic School (Kingston)",


		  "Holy Name of Jesus Catholic School (Hornepayne)",


		  "Holy Name of Jesus Separate School (Hamilton)",


		  "Holy Name of Mary Catholic School (Hamilton)",


		  "Holy Name of Mary Catholic School (Tyendinaga)",


		  "Holy Name of Mary School (St. Marys)",


		  "Holy Name of Mary Separate School (Mississippi Mills)",


		  "Holy Name Separate School (Pembroke)",


		  "Holy Redeemer Catholic School (Pickering)",


		  "Holy Redeemer Catholic School (Toronto)",


		  "Holy Redeemer Elementary School (Ottawa)",


		  "Holy Rosary Catholic Elementary School (Waterloo)",


		  "Holy Rosary Catholic School (Guelph)",


		  "Holy Rosary Catholic School (Toronto)",


		  "Holy Rosary Catholic School (Belleville)",


		  "Holy Rosary Catholic School (Plympton-Wyoming)",


		  "Holy Rosary Separate School (Burlington)",


		  "Holy Rosary Separate School (London)",


		  "Holy Rosary Separate School (Milton)",


		  "Holy Saviour (Marathon)",


		  "Holy Spirit Catholic Elementary School (Aurora)",


		  "Holy Spirit Catholic Elementary School (Brampton)",


		  "Holy Spirit Catholic Elementary School (Cambridge)",


		  "Holy Spirit Catholic School (Toronto)",


		  "Holy Spirit Elementary School (Ottawa)",


		  "Holy Spirit Separate School (Hamilton)",


		  "Holy Trinity Catholic Elementary School (Cornwall)",


		  "Holy Trinity Catholic Intermediate School (Ottawa)",


		  "Holy Trinity Catholic School (Guelph)",


		  "Holy Trinity Catholic School (Sarnia)",


		  "Homelands Senior Public School (Mississauga)",


		  "Homestead Public School (Brampton)",


		  "Hon Earl Rowe Public School (Bradford West Gwillimbury)",


		  "Hopewell Avenue Public School (Ottawa)",


		  "Horizon Alternative Senior School (Toronto)",


		  "Hornepayne Public School (Hornepayne)",


		  "Houghton Public School (Norfolk County)",


		  "Howard Junior Public School (Toronto)",


		  "Howard Robertson Public School (Kitchener)",


		  "Howick Central School (Howick)",


		  "Hugh Beaton Public School (Windsor)",


		  "Hullett Central Public School (Central Huron)",


		  "Humbercrest Public School (Toronto)",


		  "Humber Summit Middle School (Toronto)",


		  "Humber Valley Village Junior Middle School (Toronto)",


		  "Humberwood Downs Junior Middle Academy (Toronto)",


		  "Humewood Community School (Toronto)",


		  "Humphrey Central Public School (Parry Sound)",


		  "Hunter's Glen Junior Public School (Toronto)",


		  "Huntington Park Junior Public School (Hamilton)",


		  "Huntington Ridge Public School (Mississauga)",


		  "Huntley Centennial Public School (Ottawa)",


		  "Huntsville Public School (Huntsville)",


		  "Huron Centennial School (Huron East)",


		  "Huron Heights Public School (London)",


		  "Huron Heights Public School (Kincardine)",


		  "Huronia Centennial Public School (Springwater)",


		  "Huron Park Public School (Midland)",


		  "Huron Street Junior Public School (Toronto)",


		  "Huttonville Public School (Brampton)",


		  "H W Burgess Public School (Chatham-Kent)",


		  "Hyde Park Public School (Thunder Bay)",


		  "Hyland Heights Elementary School (Shelburne)",


		  "Ignace Elementary School (Ignace)",


		  "Immaculata Intermediate School (Ottawa)",


		  "Immaculate Conception Catholic Elementary School (Peterborough)",


		  "Immaculate Conception Catholic Elementary School (Vaughan)",


		  "Immaculate Conception Catholic School (Greater Sudbury)",


		  "Immaculate Conception Catholic School (Scugog)",


		  "Immaculate Conception Catholic School (Toronto)",


		  "Immaculate Conception Catholic School (Windsor)",


		  "Immaculate Conception Elementary School (Hamilton)",


		  "Immaculate Conception Separate School (South Bruce)",


		  "Immaculate Conception Separate School (Cornwall)",


		  "Immaculate Heart of Mary Catholic School (Toronto)",


		  "Immaculate Heart of Mary Separate School (Hamilton)",


		  "Indian Creek Road Public School (Chatham-Kent)",


		  "Indian Road Crescent Junior Public School (Toronto)",


		  "Inglewood Heights Junior Public School (Toronto)",


		  "Innerkip Central School (East Zorra-Tavistock)",


		  "Innisfil Central Public School (Innisfil)",


		  "Iona Academy (South Glengarry)",


		  "Ionview Public School (Toronto)",


		  "Iron Bridge Public School (Huron Shores)",


		  "Iroquois Falls Public School (Iroquois Falls)",


		  "Iroquois Junior Public School (Toronto)",


		  "Iroquois Public School (South Dundas)",


		  "Irwin Memorial Public School (Lake Of Bays)",


		  "Isabel Fletcher Public School (Sault Ste. Marie)",


		  "Island Lake Public School (Orangeville)",


		  "Island Public/Natural Science School (Toronto)",


		  "Islington Junior Middle School (Toronto)",


		  "Jack Callaghan Public School (Kawartha Lakes)",


		  "Jack Chambers Public School (London)",


		  "Jack Donohue Public School (Ottawa)",


		  "Jackman Avenue Junior Public School (Toronto)",


		  "Jack Miner Public School (Kingsville)",


		  "Jack Miner Public School (Whitby)",


		  "Jack Miner Senior Public School (Toronto)",


		  "Jacob Beam Public School (Lincoln)",


		  "J A McWilliam Public School (Windsor)",


		  "James Bolton Public School (Caledon)",


		  "James Culnan Catholic School (Toronto)",


		  "James Grieve (Elementary) (Caledon)",


		  "James Hillier Public School (Brantford)",


		  "James Keating Public School (Penetanguishene)",


		  "James MacDonald Public School (Hamilton)",


		  "James McQueen Public School (Centre Wellington)",


		  "James Morden Public School (Niagara Falls)",


		  "James Potter Public School (Brampton)",


		  "James R Henderson Public School (Kingston)",


		  "James Robinson Public School (Markham)",


		  "James S Bell Junior Middle School (Toronto)",


		  "James Strath Public School (Peterborough)",


		  "James W. Hill Public School (Oakville)",


		  "Janet I. McDougald Public School (Mississauga)",


		  "Janet Lee Public School (Hamilton)",


		  "Jarvis Public School (Haldimand County)",


		  "J B Tyrrell Senior Public School (Toronto)",


		  "J Douglas Hodgson Elementary School (Dysart Et Al)",


		  "J Douglas Hogarth Public School (Centre Wellington)",


		  "Jean Little Public School (Guelph)",


		  "Jeanne Sauvé Catholic School (Stratford)",


		  "Jeanne-Sauvé Public School (London)",


		  "Jean Vanier Catholic Elementary School (Brantford)",


		  "Jean Vanier Separate School (London)",


		  "J E Benson Public School (Windsor)",


		  "Jefferson Public School (Brampton)",


		  "J E Horton Public School (Kingston)",


		  "Jersey Public School (Georgina)",


		  "Jesse Ketchum Junior and Senior Public School (Toronto)",


		  "J F Carmichael Public School (Kitchener)",


		  "J G Workman Public School (Toronto)",


		  "J.H.  Putman Public School (Ottawa)",


		  "J J O'Neill Catholic School (Greater Napanee)",


		  "J L Jordan Separate School (Brockville)",


		  "J L Mitchener Public School (Haldimand County)",


		  "J L R Bell Public School (Newmarket)",


		  "J M Denyes Public School (Milton)",


		  "Jockvale Elementary School (Ottawa)",


		  "John A Leslie Public School (Toronto)",


		  "John Black Public School (Centre Wellington)",


		  "John Buchan Senior Public School (Toronto)",


		  "John Campbell Public School (Windsor)",


		  "John Darling Public School (Kitchener)",


		  "John Dearness Public School (London)",


		  "John D Parker Junior School (Toronto)",


		  "John Dryden Public School (Whitby)",


		  "John English Junior Middle School (Toronto)",


		  "John Fisher Junior Public School (Toronto)",


		  "John G Althouse Middle School (Toronto)",


		  "John G Diefenbaker Public School (Toronto)",


		  "John Graves Simcoe Public School (Kingston)",


		  "John Mahood Public School (Woolwich)",


		  "John Marshall Public School (Niagara Falls)",


		  "John McCrae Public School (Markham)",


		  "John McCrae Public School (Toronto)",


		  "John McCrae Public School (Guelph)",


		  "John McGivney Children's Centre School (Windsor)",


		  "John M James School (Clarington)",


		  "John N Given Public School (Chatham-Kent)",


		  "John Paul II Elementary School (Ottawa)",


		  "John P Robarts Public School (London)",


		  "John Ross Robertson Junior Public School (Toronto)",


		  "Johnson Street Public School (Barrie)",


		  "Johnson-Tarbutt Central Public School (Johnson)",


		  "Johnsview Village Public School (Thornhill)",


		  "John Sweeney Catholic Elementary School (Kitchener)",


		  "John T Tuck Public School (Burlington)",


		  "John Wanless Junior Public School (Toronto)",


		  "John William Boich Public School (Burlington)",


		  "John Wise Public School (St. Thomas)",


		  "John XXIII Catholic School (Kingston)",


		  "John XXIII Catholic School (Oshawa)",


		  "John XXIII Separate School (Arnprior)",


		  "John XXIII Separate School (North Bay)",


		  "John Young Elementary School (Ottawa)",


		  "Jordan Public School (Lincoln)",


		  "Joseph A Gibson (Vaughan)",


		  "Joseph Brant Senior Public School (Toronto)",


		  "Joseph Gibbons Public School (Halton Hills)",


		  "Joseph Gould Public School (Uxbridge)",


		  "Joseph H Kennedy Public School (Black River-Matheson)",


		  "Joseph Howe Senior Public School (Toronto)",


		  "Joshua Creek Public School (Oakville)",


		  "Josyf Cardinal Slipyj Catholic School (Toronto)",


		  "Joyce Public School (Toronto)",


		  "Joyceville Public School (Kingston)",


		  "J R Wilcox Community School (Toronto)",


		  "J S Woodsworth Senior Public School (Toronto)",


		  "Julie Payette (Whitby)",


		  "Julliard Public School (Vaughan)",


		  "June Avenue Public School (Guelph)",


		  "June Rose Callwood Public School (St. Thomas)",


		  "J W Gerth Public School (Kitchener)",


		  "J W Trusler Public School (North Bay)",


		  "J W Walker Public School (Fort Frances)",


		  "Kakabeka Falls District Public School (Oliver Paipoonge)",


		  "Karen Kain School of the Arts (Toronto)",


		  "Kars Public School (Ottawa)",


		  "Kateri Tekakwitha Catholic Elementary School (Markham)",


		  "Kate S Durdan Public School (Niagara Falls)",


		  "Katimavik Elementary School (Ottawa)",


		  "Kawartha Heights Public School (Peterborough)",


		  "Keatsway Public School (Waterloo)",


		  "Kedron Public School (Oshawa)",


		  "Keelesdale Junior Public School (Toronto)",


		  "Keele Street Junior Public School (Toronto)",


		  "Keewatin Public School (Kenora)",


		  "Keith Wightman Public School (Peterborough)",


		  "Kemptville Public School (North Grenville)",


		  "Ken Danby Public School (Guelph)",


		  "Kenilworth Public School (Wellington North)",


		  "Kennedy Public School (Toronto)",


		  "Kenner Intermediate School (Peterborough)",


		  "Kenollie Public School (Mississauga)",


		  "Kensal Park Public School (London)",


		  "Kensington Community School (Toronto)",


		  "Kente Public School (Prince Edward County)",


		  "Kent Public School (Trent Hills)",


		  "Kent Senior Public School (Toronto)",


		  "Keppel-Sarawak Elementary School (Owen Sound)",


		  "Kerns Public School (Thornloe)",


		  "Keswick Public School (Georgina)",


		  "Kettleby Public School (King)",


		  "Kettle Lakes Public School (Richmond Hill)",


		  "Kew Beach Junior Public School (Toronto)",


		  "KidsAbility School (Waterloo)",


		  "Kilbride Public School (Burlington)",


		  "Killaloe Public School (Killaloe, Hagarty And Richards)",


		  "Killarney Beach Public School (Innisfil)",


		  "Kimberley Junior Public School (Toronto)",


		  "Kincardine Township-Tiverton Public School (Kincardine)",


		  "Kindree Public School (Mississauga)",


		  "King Albert Public School (Kawartha Lakes)",


		  "King City Public School (King)",


		  "King Edward Junior and Senior Public School (Toronto)",


		  "King Edward Public School (Kitchener)",


		  "King Edward Public School (Windsor)",


		  "King George Junior Public School (Hamilton)",


		  "King George Junior Public School (Toronto)",


		  "King George Public School (Peterborough)",


		  "King George Public School (North Bay)",


		  "King George Public School ()",


		  "King George Public School (Guelph)",


		  "King George School (Brantford)",


		  "King George VI Public School (Kenora)",


		  "King George VI Public School (Chatham-Kent)",


		  "King George VI Public School (Sarnia)",


		  "Kinghurst Community (Arran-Elderslie)",


		  "Kingslake Public School (Toronto)",


		  "Kings Masting Public School (Mississauga)",


		  "Kings Road Public School (Burlington)",


		  "Kingsview Village Junior School (Toronto)",


		  "Kingsville Public School (Kingsville)",


		  "Kingsway Park Public School (Thunder Bay)",


		  "Kingswood Drive Public School (Brampton)",


		  "Kinnwood Central Public School (Lambton Shores)",


		  "Kinsmen/Vincent Massey School (Cornwall)",


		  "Kirby Centennial Public School (Clarington)",


		  "Kirkland Lake District Composite Elementary School (Kirkland Lake)",


		  "Kiwedin Public School (Sault Ste. Marie)",


		  "Kleinburg Public School (Vaughan)",


		  "Knob Hill Public School (Toronto)",


		  "Knollwood Park Public School (London)",


		  "Knoxdale Public School (Ottawa)",


		  "Kortright Hills Public School (Guelph)",


		  "K P Manson Public School (Severn)",


		  "Lackner Woods (Kitchener)",


		  "L A Desmarais Catholic School (Windsor)",


		  "Lady Eaton Elementary School (Kawartha Lakes)",


		  "Lady Evelyn Alternative School (Ottawa)",


		  "Lady Mackenzie Public School (Kawartha Lakes)",


		  "Laggan Public School (North Glengarry)",


		  "Laird Central Public School (Macdonald, Meredith And Aberdeen Additional)",


		  "Lake Avenue Public School (Hamilton)",


		  "Lakefield Intermediate School (Smith-Ennismore-Lakefield)",


		  "Lakeroad Public School (Sarnia)",


		  "Lakeshore Discovery School (Lakeshore)",


		  "Lakeshore Public School (Burlington)",


		  "Lakeside Public School (Georgina)",


		  "Lakeside Public School (Ajax)",


		  "Lake Simcoe Public School (Georgina)",


		  "Lakeview Public School (Grimsby)",


		  "Lakeview Public School (Ottawa)",


		  "Lake Wilcox Public School (Richmond Hill)",


		  "Lakewood School (Kenora)",


		  "Lakewoods Public School (Oshawa)",


		  "Lamberton Public School (Toronto)",


		  "Lambeth Public School (London)",


		  "Lambton Central Centennial School (Petrolia)",


		  "Lambton Kingsway Junior Middle School (Toronto)",


		  "Lambton Park Community School (Toronto)",


		  "Lancaster Drive Public School (Kingston)",


		  "Lancaster Public School (Mississauga)",


		  "Land of Lakes Senior Public School (Burk'S Falls)",


		  "Land O Lakes Public School (Central Frontenac)",


		  "Langton Public School (Norfolk County)",


		  "Langton Public School (Kawartha Lakes)",


		  "Lanor Junior Middle School (Toronto)",


		  "Lansdowne-Costain Public School (Brantford)",


		  "Lansdowne Public School (Sarnia)",


		  "Lansdowne Public School (Greater Sudbury)",


		  "Larchwood Public School (Greater Sudbury)",


		  "Larkspur Public School (Brampton)",


		  "LaSalle Public School (Lasalle)",


		  "Laurelwood Public School (Waterloo)",


		  "Laurelwoods Elementary School (Orangeville)",


		  "Laurentian Public School (Kitchener)",


		  "Laurie Hawkins Public School (Ingersoll)",


		  "Laurine Avenue Public School (Guelph)",


		  "Lawfield Elementary School (Hamilton)",


		  "Lawrence Heights Middle School (Toronto)",


		  "Ledbury Park Elementary and Middle School (Toronto)",


		  "Legacy Public School (Markham)",


		  "Le Phare Elementary School (Ottawa)",


		  "Lescon Public School (Toronto)",


		  "Leslie Frost Public School (Kawartha Lakes)",


		  "Leslie Park Public School (Ottawa)",


		  "Leslieville Junior Public School (Toronto)",


		  "Lester B. Pearson Catholic Intermediate School (Ottawa)",


		  "Lester B Pearson Catholic School (Brampton)",


		  "Lester B Pearson Elementary School (Toronto)",


		  "Lester B Pearson PS (Waterloo)",


		  "Lester B Pearson Public School (Aurora)",


		  "Lester B Pearson Public School (Ajax)",


		  "Lester B Pearson School for the Arts (London)",


		  "Levack Public School (Greater Sudbury)",


		  "Levi Creek Public School (Mississauga)",


		  "Lexington Public School (Waterloo)",


		  "Light of Christ Catholic Elementary School (Aurora)",


		  "Lillian Berg School (Machin)",


		  "Lillian Public School (Toronto)",


		  "Limehouse Public School (Halton Hills)",


		  "Lincoln Alexander Public School (Ajax)",


		  "Lincoln Alexander Public School (Hamilton)",


		  "Lincoln Alexander Public School (Markham)",


		  "Lincoln Avenue Public School (Cambridge)",


		  "Lincoln Avenue Public School (Ajax)",


		  "Lincoln Centennial Public School (St. Catharines)",


		  "Lincoln Heights Public School (Waterloo)",


		  "Linden Park Junior Public School (Hamilton)",


		  "Linklater Public School (Gananoque)",


		  "Linwood Public School (Wellesley)",


		  "Lions Oval Public School (Orillia)",


		  "Lisgar Junior Public School (Hamilton)",


		  "Lisgar Middle School (Mississauga)",


		  "Listowel Central Public School (North Perth)",


		  "Listowel Eastdale Public School (North Perth)",


		  "Little Current Public School (Northeastern Manitoulin And The Islands)",


		  "Little Falls Public School Public School (St. Marys)",


		  "Little Rouge Public School (Markham)",


		  "Lively District Elementary School (Greater Sudbury)",


		  "Lockes Public School (St. Thomas)",


		  "Lockview Public School (St. Catharines)",


		  "Lombardy Public School (Rideau Lakes)",


		  "London Road School (Sarnia)",


		  "Longfields Davidson Heights Intermediate School (Ottawa)",


		  "Longue Sault Public School (South Stormont)",


		  "Lord Dufferin Junior and Senior Public School (Toronto)",


		  "Lord Elgin Public School (Ajax)",


		  "Lord Elgin Public School (London)",


		  "Lord Lansdowne Junior and Senior Public School (Toronto)",


		  "Lord Nelson Public School (London)",


		  "Lord Roberts Junior Public School (Toronto)",


		  "Lord Roberts Public School (London)",


		  "Lord Strathcona Public School (Kingston)",


		  "Loretto Catholic Elementary School (Niagara Falls)",


		  "Lorna Jackson Public School (Vaughan)",


		  "Lorne Avenue Public School (London)",


		  "Lorne Park Public School (Mississauga)",


		  "Loughborough Public School (South Frontenac)",


		  "Lougheed Middle School (Brampton)",


		  "Louis-Honore Frechette Public School (Thornhill)",


		  "Lucknow Central Public School (Huron-Kinloss)",


		  "Lucy Maud Montgomery Public School (Toronto)",


		  "Lucy McCormick Senior School (Toronto)",


		  "Lumen Christi Catholic Elementary School Elementary School (Burlington)",


		  "Lydia Trull Public School (Clarington)",


		  "Lynndale Heights Public School (Norfolk)",


		  "Lynngate Junior Public School (Toronto)",


		  "Lynnwood Heights Junior Public School (Toronto)",


		  "Lyn Public School (Elizabethtown-Kitley)",


		  "Macaulay Public School (Bracebridge)",


		  "MacGregor Public School (Waterloo)",


		  "Mackenzie Community School - Elementary School (Deep River)",


		  "Mackenzie Glen Public School (Vaughan)",


		  "MacKenzie King Public School (Kitchener)",


		  "Macklin Public School (Toronto)",


		  "MacLeod Public School (Greater Sudbury)",


		  "MacLeod's Landing Public School (Richmond Hill)",


		  "Macphail Memorial Elementary School (Grey Highlands)",


		  "Mactier Public School (Georgian Bay)",


		  "Macville Public School (Caledon)",


		  "Madawaska Public School (South Algonquin)",


		  "Madoc Drive Public School (Brampton)",


		  "Madoc Public School (Centre Hasting)",


		  "Madoc Township Public School (Centre Hasting)",


		  "Magnetawan Central Public School (Magnetawan)",


		  "Maitland River Elementary School (North Huron)",


		  "Major Ballachey Public School (Brantford)",


		  "Malden Central Public School (Amherstburg)",


		  "Malvern Junior Public School (Toronto)",


		  "Manchester Public School (Cambridge)",


		  "Manhattan Park Junior Public School (Toronto)",


		  "Manitouwadge Public School (Manitouwadge)",


		  "Manordale Public School (Ottawa)",


		  "Manor Park Public School (Ottawa)",


		  "Manotick Public School (Ottawa)",


		  "Maple Creek Public School (Vaughan)",


		  "Maple Grove Public School (Oakville)",


		  "Maple Grove Public School (Barrie)",


		  "Maple Grove Public School (Lanark Highlands)",


		  "Maplehurst Public School (Burlington)",


		  "Maple Lane Public School (Tillsonburg)",


		  "Maple Leaf Public School (Newmarket)",


		  "Maple Leaf Public School (Toronto)",


		  "Maple Ridge Elementary School (Ottawa)",


		  "Mapleridge Public School (Powassan)",


		  "Maple Ridge Public School (Pickering)",


		  "Mapleview Heights Elementary School (Barrie)",


		  "Maple Wood Public School (Mississauga)",


		  "Marchmont Public School (Orillia)",


		  "Margaret Avenue Public School (Kitchener)",


		  "Margaret D Bennie Public School (Leamington)",


		  "Margaret Twomey Public School (Marathon)",


		  "Marie of the Incarnation Separate School (Bradford West Gwillimbury)",


		  "Mariposa Elementary School (Kawartha Lakes)",


		  "Marjorie Mills Public School (Greenstone)",


		  "Market Lane Junior and Senior Public School (Toronto)",


		  "Markham Gateway Public School (Markham)",


		  "Markstay Public School (Markstay-Warren)",


		  "Marlborough Public School (Windsor)",


		  "Marmora Senior Public School (Marmora And Lake)",


		  "Marshall Park Public School (North Bay)",


		  "Martha Cullimore Public School (Niagara Falls)",


		  "Martin Street Public School (Milton)",


		  "Marvin Heights Public School (Mississauga)",


		  "Maryborough Public School (Mapleton)",


		  "Mary Fix Catholic School (Mississauga)",


		  "Mary Honeywell Elementary School (Ottawa)",


		  "Mary Hopkins Public School (Hamilton)",


		  "Mary Immaculate Community (Brockton)",


		  "Mary Johnston Public School (Waterloo)",


		  "Marymount Elementary Academy (Greater Sudbury)",


		  "Mary Phelan Catholic School (Guelph)",


		  "Mary Shadd Public School (Toronto)",


		  "Mary Street Community School (Oshawa)",


		  "Marysville Public School (Frontenac Islands)",


		  "Maryvale Public School (Toronto)",


		  "Mary Ward Catholic Elementary School (Niagara Falls)",


		  "Mason Road Junior Public School (Toronto)",


		  "Masonville Public School (London)",


		  "Massassaga-Rednersville Public School (Belleville)",


		  "Massey Street Public School (Brampton)",


		  "Mathews Public School (Welland)",


		  "Mattawa District Public School (Mattawa)",


		  "Maurice Cody Junior Public School (Toronto)",


		  "M A Wittick Junior Public School (Burk'S Falls)",


		  "Maxville Public School (North Glengarry)",


		  "Mayfield West PS (Caledon)",


		  "Maynard Public School (Prescott)",


		  "Maynooth Public School (Hastings Highlands)",


		  "Maywood Public School (St. Catharines)",


		  "Mazo De La Roche Public School (Newmarket)",


		  "McBride Avenue Public School (Mississauga)",


		  "McCaskill's Mills Public School (Brock)",


		  "McCrimmon Middle School (Brampton)",


		  "McCrosson-Tovell Public School (Dawson)",


		  "McDougall Public School (Parry Sound)",


		  "McGillivray Central School (North Middlesex)",


		  "McGregor Public School (Aylmer)",


		  "McHugh Public School (Brampton)",


		  "McKay Public School (Port Colborne)",


		  "McKee Public School (Toronto)",


		  "McKellar Park Central Public School (Thunder Bay)",


		  "McKenzie Public School (Shuniah)",


		  "McKenzie-Smith Bennett (Halton Hills)",


		  "McKinnon Public School (Mississauga)",


		  "McMasterCatholic Elementary School (Ottawa)",


		  "McMurrich Junior Public School (Toronto)",


		  "McNab Public School (Arnprior)",


		  "McNaughton Ave Public School (Chatham-Kent)",


		  "Meadowbrook Public School (Newmarket)",


		  "Meadowcrest Public School (Whitby)",


		  "Meadowlands Public School (Ottawa)",


		  "Meadowlane Public School (Kitchener)",


		  "Meadowvale Public School (Toronto)",


		  "Meadowvale Public School (St. Catharines)",


		  "Meadowvale Village Public School (Mississauga)",


		  "Meadowview Public School (Elizabethtown-Kitley)",


		  "Meaford Community School (Meaford)",


		  "Melody Village Junior School (Toronto)",


		  "Memorial (City) School (Hamilton)",


		  "Memorial Public School (St. Catharines)",


		  "Memorial Public School (Hamilton)",


		  "Merlin Area Public School (Chatham-Kent)",


		  "Merrickville Public School (Merrickville-Wolford)",


		  "Merwin Greer School (Cobourg)",


		  "Metcalfe Public School (Ottawa)",


		  "Metropolitan Andrei Catholic School (Mississauga)",


		  "Metropolitan Toronto School for the Deaf (Toronto)",


		  "Michael Cranny Elementary School (Vaughan)",


		  "Michael J Brennan Catholic Elementary School (St. Catharines)",


		  "Michaelle Jean Public School (Richmond Hill)",


		  "Middlebury Public School (Mississauga)",


		  "Mildmay-Carrick Central School (South Bruce)",


		  "Military Trail Public School (Toronto)",


		  "Millbrook/South Cavan Public School (Millbrook)",


		  "Millen Woods Public School (Waterloo)",


		  "Miller's Grove School (Mississauga)",


		  "Millgrove Public School (Hamilton)",


		  "Milliken Mills Public School (Markham)",


		  "Milliken Public School (Toronto)",


		  "Mill Street Public School (Leamington)",


		  "Mill Valley Junior School (Toronto)",


		  "Millwood Junior School (Toronto)",


		  "Milne Valley Middle School (Toronto)",


		  "Milverton Public School (Perth East)",


		  "Mine Centre Public School (Mine Centre)",


		  "Mineola Public School (Mississauga)",


		  "Minesing Central Public School (Springwater)",


		  "Ministik Public School (Moose Factory)",


		  "Minto-Clifford Central Public School (Minto)",


		  "Missarenda Consolidated Public School (Missanabie)",


		  "Mitchell Hepburn Public School (St. Thomas)",


		  "Mitchell Woods Public School (Guelph)",


		  "M J Hobbs Senior Public School (Clarington)",


		  "Module de l'Acadie (Kingston)",


		  "Module Vanier (Kingston)",


		  "Moffat Creek Public School (Kitchener)",


		  "Mohawk Gardens Public School (Burlington)",


		  "Monck Public School (Bracebridge)",


		  "Monetville Public School (Monetville)",


		  "Mono-Amaranth Public School (Orangeville)",


		  "Monsignor Castex Separate School (Midland)",


		  "Monsignor Clair Separate School (Barrie)",


		  "Monsignor Clancy Catholic Elementary School (Thorold)",


		  "Monsignor Haller Catholic Elementary School (Kitchener)",


		  "Monsignor J E Ronan Catholic School (New Tecumseth)",


		  "Monsignor J H O'Neil School (Tillsonburg)",


		  "Monsignor Lee Separate School (Orillia)",


		  "Monsignor Leo Cleary Catholic Elementary School (Clarington)",


		  "Monsignor Michael O'Leary School (Bracebridge)",


		  "Monsignor Morrison Separate School (St. Thomas)",


		  "Monsignor O'Donoghue Catholic Elementary School (Peterborough)",


		  "Monsignor Paul Baxter Elementary School (Ottawa)",


		  "Monsignor Philip Coffey Catholic School (Oshawa)",


		  "Monsignor Uyen Catholic School (Chatham-Kent)",


		  "Montague Public School (Smiths Falls)",


		  "Montclair Public School (Oakville)",


		  "Montgomery Village Public School (Orangeville)",


		  "Montrose Junior Public School (Toronto)",


		  "Moonstone Elementary School (Oro-Medonte)",


		  "Mooretown-Courtright School (St. Clair)",


		  "Moosonee Public School (Moosonee)",


		  "Moraine Hills Public School (Richmond Hill)",


		  "Morning Glory Public School (Georgina)",


		  "Morning Star Middle School (Mississauga)",


		  "Mornington Central Public School (Perth East)",


		  "Morrisburg Public School (South Dundas)",


		  "Morrish Public School (Toronto)",


		  "Morse Street Junior Public School (Toronto)",


		  "Morton Way Public School (Brampton)",


		  "Mosa Central Public School (Southwest Middlesex)",


		  "Mother Cabrini Catholic School (Toronto)",


		  "Mother St Bride School (North Bay)",


		  "Mother Teresa (Brockton)",


		  "Mother Teresa Catholic (Russell)",


		  "Mother Teresa Catholic Elementary School (St. Catharines)",


		  "Mother Teresa Catholic Elementary School (Cambridge)",


		  "Mother Teresa Catholic Elementary School (Oakville)",


		  "Mother Teresa Catholic Elementary School (Markham)",


		  "Mother Teresa Catholic Elementary School (Clarington)",


		  "Mother Teresa Catholic Intermediate School (Ottawa)",


		  "Mother Teresa Catholic School (Ajax)",


		  "Mother Teresa Catholic School (Bradford West Gwillimbury)",


		  "Mother Teresa Catholic School (Kingston)",


		  "Mountain Ash Middle School (Brampton)",


		  "Mountain View Public School (Goulais River)",


		  "Mountain View Public School (Hamilton)",


		  "Mountain View Public School (Collingwood)",


		  "Mount Albert Public School (East Gwillimbury)",


		  "Mount Albion Public School (Hamilton)",


		  "Mount Carmel Blytheswood Public School (Leamington)",


		  "Mount Hope Public School (Hamilton)",


		  "Mount Joy Public School (Markham)",


		  "Mount Pleasant School (Brant)",


		  "Mount Pleasant Village Public School (Brampton)",


		  "Mount Royal Public School (Brampton)",


		  "Mountsfield Public School (London)",


		  "Mountview Alternative School Junior (Toronto)",


		  "Mountview Junior Public School (Hamilton)",


		  "Msgr John Corrigan Catholic School (Toronto)",


		  "M S Hetherington Public School (Windsor)",


		  "M T Davidson Public School (Callander)",


		  "Muirhead Public School (Toronto)",


		  "Munden Park Public School (Mississauga)",


		  "Mundy's Bay Elementary Public School (Midland)",


		  "Munn's Public School (Oakville)",


		  "Munster Elementary School (Ottawa)",


		  "Murray Centennial Public School (Quinte West)",


		  "Muskoka Beechgrove Public School (Gravenhurst)",


		  "Muskoka Falls Public School (Bracebridge)",


		  "Mutchmor Public School (Ottawa)",


		  "M W Moore Public School (Shining Tree)",


		  "Naahii Ridge Public School (Chatham-Kent)",


		  "Nahani Way Public School (Mississauga)",


		  "Naismith Memorial Public School (Mississippi Mills)",


		  "Nakina Public School (Greenstone)",


		  "N A MacEachern Public School (Waterloo)",


		  "Nationview Public School (North Dundas)",


		  "Nativity of Our Lord Catholic School (Toronto)",


		  "Nelles Public School (Grimsby)",


		  "Nellie McClung Public School (Vaughan)",


		  "Nelson Mandela Park Public School (Toronto)",


		  "Nestor Falls Public School (Sioux Narrows-Nestor Falls)",


		  "Newburgh Public School (Stone Mills)",


		  "Newcastle Public School (Clarington)",


		  "New Central Public School (Oakville)",


		  "New Dundee Public School (Wilmot)",


		  "New Huron Road Public School ()",


		  "New Liskeard Public School (Temiskaming Shores)",


		  "New Lowell Central Public School (Clearview)",


		  "New Prospect School (Dryden)",


		  "New Sarum Public School (St. Thomas)",


		  "New school to open Sept. 2012 - North Ajax (Ajax)",


		  "New Stirling School ()",


		  "Niagara Peninsula Children's Centre School (St. Catharines)",


		  "Niagara Street Junior Public School (Toronto)",


		  "Nicholas Wilson Public School (London)",


		  "Nobel Public School (Mcdougall)",


		  "Nobleton Junior Public School (King)",


		  "Nobleton Senior Public School (King)",


		  "Normanby Community School (West Grey)",


		  "Norman Cook Junior Public School (Toronto)",


		  "Norman G. Powers Public School (Oshawa)",


		  "Norman Ingram Public School (Toronto)",


		  "Norseman Junior Middle School (Toronto)",


		  "North Addington Education Centre Public School (North Frontenac)",


		  "North Agincourt Junior Public School (Toronto)",


		  "North Bendale Junior Public School (Toronto)",


		  "Northbrae Public School (London)",


		  "North Bridlewood Junior Public School (Toronto)",


		  "North Cavan Public School (Cavan-Monaghan)",


		  "Northdale Central Public School (Thames Centre)",


		  "Northdale Public School (Woodstock)",


		  "North Dundas Intermediate School (North Dundas)",


		  "Northeastern Elementary School (Greater Sudbury)",


		  "North Easthope Public School (Stratford)",


		  "North Elmsley Public School (Perth)",


		  "Northern Heights Public School (Sault Ste. Marie)",


		  "Northern Lights Public School (Aurora)",


		  "North Gower/Marlborough Public School (Ottawa)",


		  "North Hope Central Public School (Port Hope)",


		  "North Ingersoll Public School (Ingersoll)",


		  "North Kipling Junior Middle School (Toronto)",


		  "Northlake Woods Public School (Waterloo)",


		  "Northlea Elementary and Middle School (Toronto)",


		  "North Meadows Elementary School (Strathroy-Caradoc)",


		  "North Norwich Public School (Norwich)",


		  "Northport Elementary School (Saugeen Shores)",


		  "North Preparatory Junior Public School (Toronto)",


		  "Northridge Public School (London)",


		  "North Shore Public School (Otonabee-South Monaghan)",


		  "North Star Community School (Atikokan)",


		  "North Stormont Public School (North Stormont)",


		  "North Trenton Public School (Quinte West)",


		  "Northumberland Hills Public School (Cramahe)",


		  "North Ward School (Brant)",


		  "Northwood Public School (Brampton)",


		  "Northwood Public School (Windsor)",


		  "Norway Junior Public School (Toronto)",


		  "Nor'wester View Public School (Thunder Bay)",


		  "Norwich Public School (Norwich)",


		  "Norwood District Public School (Asphodel-Norwood)",


		  "Norwood Park Elementary School (Hamilton)",


		  "Notre Dame Catholic Elementary School (Haldimand County)",


		  "Notre Dame Catholic Elementary School (Newmarket)",


		  "Notre Dame Catholic Elementary School (Niagara Falls)",


		  "Notre Dame Catholic Elementary School (Cobourg)",


		  "Notre Dame Catholic School (Orillia)",


		  "Notre Dame Catholic School (Owen Sound)",


		  "Notre Dame Catholic School (Windsor)",


		  "Notre Dame Catholic Separate School (Carleton Place)",


		  "Notre-Dame-des-Écoles (Greenstone)",


		  "Notre Dame Intermediate School (Ottawa)",


		  "Notre Dame School (Brantford)",


		  "Notre Dame Separate School (London)",


		  "Nottawa Elementary School (Collingwood)",


		  "Nottawasaga and Creemore Public School (Clearview)",


		  "Nottingham Public School (Ajax)",


		  "Oakdale Park Middle School (Toronto)",


		  "Oakland-Scotland Public School (Brant)",


		  "Oakley Park Public School (Barrie)",


		  "Oakridge Junior Public School (Toronto)",


		  "Oakridge Public School (Mississauga)",


		  "Oakridge Public School (St. Catharines)",


		  "Oak Ridges Public School (Richmond Hill)",


		  "Oakwood Public School (Oakville)",


		  "Oakwood Public School (Port Colborne)",


		  "Oakwood Public School (Windsor)",


		  "O'Connor Public School (Toronto)",


		  "Odessa Public School (Loyalist)",


		  "Ogden Community Public School (Thunder Bay)",


		  "Ogden Junior Public School (Toronto)",


		  "O'Gorman Intermediate Catholic School (Timmins)",


		  "Oliver Stephens Public School (Woodstock)",


		  "O M MacKillop Public School (Richmond Hill)",


		  "Oneida Central Public School (Haldimand County)",


		  "Onondaga-Brant Public School (Brantford)",


		  "Ontario Public School (Thorold)",


		  "Ontario Street Public School (Clarington)",


		  "Open Roads Public School (Dryden)",


		  "Orchard Park Elementary School (Orillia)",


		  "Orchard Park Public School (Niagara Falls)",


		  "Orchard Park Public School (Burlington)",


		  "Orchard Park Public School (London)",


		  "Orde Street Junior Public School (Toronto)",


		  "Oriole Park Junior Public School (Toronto)",


		  "Orleans Wood Elementary School (Ottawa)",


		  "Ormiston Public School (Whitby)",


		  "Orono Public School (Clarington)",


		  "Oscar Peterson Public School (Whitchurch-Stouffville)",


		  "Oscar Peterson Public School (Mississauga)",


		  "Osgoode Public School (Ottawa)",


		  "Osprey Central School (Grey Highlands)",


		  "Osprey Woods Public School (Mississauga)",


		  "Ossington/Old Orchard Junior Public School (Toronto)",


		  "Otonabee Valley Public School (Peterborough)",


		  "Ottawa Children's Treatment Centre School (Ottawa)",


		  "Ottawa Crescent Public School (Guelph)",


		  "Otterville Public School (Norwich)",


		  "Our Lady Help of Christians Catholic Elementary School (Richmond Hill)",


		  "Our Lady Immaculate School (Strathroy-Caradoc)",


		  "Our Lady of Charity Catholic Elementary School (Thunder Bay)",


		  "Our Lady of Fatima Catholic Elementary School (Milton)",


		  "Our Lady of Fatima Catholic Elementary School (Grimsby)",


		  "Our Lady of Fatima Catholic Elementary School (Cambridge)",


		  "Our Lady of Fatima Catholic Elementary School (St. Catharines)",


		  "Our Lady of Fatima Catholic Elementary School (Vaughan)",


		  "Our Lady of Fatima Catholic School (Belleville)",


		  "Our Lady of Fatima Catholic School (Elliot Lake)",


		  "Our Lady of Fatima Catholic School (Toronto)",


		  "Our Lady of Fatima Catholic School (Chatham-Kent)",


		  "Our Lady of Fatima Catholic School (Chapleau)",


		  "Our Lady of Fatima Elementary School (Ottawa)",


		  "Our Lady of Fatima School (Brampton)",


		  "Our Lady of Fatima School (Norfolk County)",


		  "Our Lady of Fatima Separate School (Renfrew)",


		  "Our Lady of Fatima Separate School (Greenstone)",


		  "Our Lady of Fatima Separate School (North Bay)",


		  "Our Lady of Good Counsel Catholic Elementary School (East Gwillimbury)",


		  "Our Lady of Good Counsel Separate School (South Stormont)",


		  "Our Lady of Good Voyage Catholic School (Mississauga)",


		  "Our Lady of Grace Catholic Elementary School (Aurora)",


		  "Our Lady of Grace Catholic Elementary School (Kitchener)",


		  "Our Lady of Grace Catholic School (Toronto)",


		  "Our Lady of Grace School (Essa)",


		  "Our Lady of Grace Separate School (Whitewater Region)",


		  "Our Lady of Guadalupe Catholic School (Toronto)",


		  "Our Lady of Hope Catholic Elementary School (Richmond Hill)",


		  "Our Lady of La Salette Separate School (Norfolk County)",


		  "Our Lady of Lourdes Catholic Elementary School (Waterloo)",


		  "Our Lady of Lourdes Catholic Elementary School (Brampton)",


		  "Our Lady of Lourdes Catholic School (Sault Ste. Marie)",


		  "Our Lady of Lourdes Catholic School (Toronto)",


		  "Our Lady of Lourdes Catholic School (Windsor)",


		  "Our Lady of Lourdes Catholic School (Kingston)",


		  "Our Lady of Lourdes French Immersion Catholic School (Elliot Lake)",


		  "Our Lady of Lourdes School (Manitouwadge)",


		  "Our Lady of Lourdes Separate School (Middlesex Centre)",


		  "Our Lady of Lourdes Separate School (Springwater)",


		  "Our Lady of Lourdes Separate School (Hamilton)",


		  "Our Lady of Lourdes Separate School (Pembroke)",


		  "Our Lady of Mercy Catholic School (Bancroft)",


		  "Our Lady of Mercy Elementary School (Mississauga)",


		  "Our Lady of Mercy Separate School (Georgian Bay)",


		  "Our Lady of Mount Carmel (Hamilton)",


		  "Our Lady of Mount Carmel Catholic Elementary School (Niagara Falls)",


		  "Our Lady of Mount Carmel Catholic School (Loyalist)",


		  "Our Lady of Mount Carmel Catholic School (Windsor)",


		  "Our Lady of Mount Carmel Elementary School (Ottawa)",


		  "Our Lady of Mt Carmel School (Bluewater)",


		  "Our Lady of Peace (Hamilton)",


		  "Our Lady of Peace Catholic Elementary School (Vaughan)",


		  "Our Lady of Peace Catholic School (Toronto)",


		  "Our Lady of Peace Elementary School (Ottawa)",


		  "Our Lady of Peace School (Oakville)",


		  "Our Lady of Peace School (Brampton)",


		  "Our Lady of Perpetual Help Catholic School (Windsor)",


		  "Our Lady of Perpetual Help Catholic School (Toronto)",


		  "Our Lady of Providence Catholic Elementary School (Brantford)",


		  "Our Lady of Providence Elementary School (Brampton)",


		  "Our Lady of Sorrows Catholic School (Toronto)",


		  "Our Lady of Sorrows Separate School (Petawawa)",


		  "Our Lady of Sorrows Separate School (West Nipissing)",


		  "Our Lady of the Annunciation Catholic Elementary School (Richmond Hill)",


		  "Our Lady of the Annunciation Catholic School (Lakeshore)",


		  "Our Lady of the Assumption Catholic School (Toronto)",


		  "Our Lady of the Assumption Separate School (Hamilton)",


		  "Our Lady of the Assumption Separate School (Clearview)",


		  "Our Lady of the Bay Catholic School (Pickering)",


		  "Our Lady of the Lake Catholic Elementary School (Georgina)",


		  "Our Lady of the Rosary Catholic Elementary School (Vaughan)",


		  "Our Lady of the Way (Morley)",


		  "Our Lady of Victory Catholic Elementary School (Fort Erie)",


		  "Our Lady of Victory Catholic School (Toronto)",


		  "Our Lady of Victory Elementary School (Ottawa)",


		  "Our Lady of Victory School (Milton)",


		  "Our Lady of Wisdom Catholic School (Toronto)",


		  "Our Lady of Wisdom Elementary School (Ottawa)",


		  "Owen Public School (Toronto)",


		  "Owenwood Public School (Mississauga)",


		  "Oxbow Public School (Middlesex Centre)",


		  "Oxford on Rideau Public School (North Grenville)",


		  "Paisley Central School (Arran-Elderslie)",


		  "Paisley Road Public School (Guelph)",


		  "Pakenham Public School (Mississippi Mills)",


		  "Palermo Public School (Oakville)",


		  "Palgrave Public School (Caledon)",


		  "Palmer Rapids Public School (Brudenell, Lyndoch And Raglan)",


		  "Palmerston Avenue Junior Public School (Toronto)",


		  "Palmerston Public School (Minto)",


		  "Pape Avenue Junior Public School (Toronto)",


		  "Paris Central Public School (Brant)",


		  "Park Avenue Public School (East Gwillimbury)",


		  "Parkdale Junior and Senior Public School (Toronto)",


		  "Park Dale Public School (Belleville)",


		  "Parkdale School (Hamilton)",


		  "Parkfield Junior School (Toronto)",


		  "Parkhill-West Williams School (North Middlesex)",


		  "Parkinson Centennial School (Orangeville)",


		  "Parkland Public School (Markham)",


		  "Parkland Public School (Sault Ste. Marie)",


		  "Park Lane Public School (Toronto)",


		  "Park Lawn Junior and Middle School (Toronto)",


		  "Park Manor Public School (Woolwich)",


		  "Park Public School (Grimsby)",


		  "Park Public School (Halton Hills)",


		  "Parkside Elementary School (Toronto)",


		  "Parkview Public School (Middlesex Centre)",


		  "Parkview Public School (Windsor)",


		  "Parkview Public School (Markham)",


		  "Parkview Public School (Kawartha Lakes)",


		  "Parkway Public School (Brampton)",


		  "Parkway Public School (Cambridge)",


		  "Parliament Oak Public School (Niagara-On-The-Lake)",


		  "Parnall Public School (St. Catharines)",


		  "Paul A Fisher Public School (Burlington)",


		  "Pauline Johnson Junior Public School (Toronto)",


		  "Pauline Johnson Public School (Hamilton)",


		  "Pauline Johnson Public School (Burlington)",


		  "Pauline Junior Public School (Toronto)",


		  "Pauline Vanier Catholic Elementary School (Brampton)",


		  "Peel Alternative - North Elementary (Brampton)",


		  "Peel Alternative - South Elementary (Mississauga)",


		  "Peel Alternative - West Elementary (Mississauga)",


		  "Pelee Island Public School (Pelee)",


		  "Pelham Centre Public School (Pelham)",


		  "Pelmo Park Public School (Toronto)",


		  "P.E. McGibbon Public School (Sarnia)",


		  "Peninsula Shores District School (South Bruce Peninsula)",


		  "Percy Centennial Public School (Trent Hills)",


		  "Percy P McCallum Public School (Windsor)",


		  "Percy Williams Junior Public School (Toronto)",


		  "Perth Avenue Junior Public School (Toronto)",


		  "Perth Road Public School (South Frontenac)",


		  "Peter Secor Junior Public School (Toronto)",


		  "Pheasant Run Public School (Mississauga)",


		  "Phelps Central School (North Bay)",


		  "Pierre Berton Public School (Vaughan)",


		  "Pierre Elliott Trudeau French Immersion Public School (St. Thomas)",


		  "Pierre Elliott Trudeau Public School (Oshawa)",


		  "Pierre Laporte Middle School (Toronto)",


		  "Pilgrim Wood Public School (Oakville)",


		  "Pinecrest Memorial Elementary School (Prince Edward County)",


		  "Pinecrest Public School (Greater Sudbury)",


		  "Pinecrest Public School (Petawawa)",


		  "Pinecrest Public School (Timmins)",


		  "Pinecrest Public School (Ottawa)",


		  "Pine Glen Public School (Huntsville)",


		  "Pine Grove Public School (Oakville)",


		  "Pine Grove Public School (St. Catharines)",


		  "Pine Grove Public School (Vaughan)",


		  "Pineland Public School (Burlington)",


		  "Pine River Elementary School (Essa)",


		  "Pineview Public School (Athens)",


		  "Pineview Public School (Halton Hills)",


		  "Pine View Public School (Pembroke)",


		  "Pineway Public School (Toronto)",


		  "Pinewood Public School (Sault Ste. Marie)",


		  "Pioneer Park Public School (Kitchener)",


		  "Pius XII Catholic School (Greater Sudbury)",


		  "Plainville Public School (Hamilton)",


		  "Plantagenet Public School (Alfred And Plantagenet)",


		  "Plattsville &amp; District Public School (Blandford-Blenheim)",


		  "Pleasant Corners Public School (Champlain)",


		  "Pleasant Park Public School (Ottawa)",


		  "Pleasant Public School (Toronto)",


		  "Pleasant View Junior High School (Toronto)",


		  "Pleasantville Public School (Richmond Hill)",


		  "Plowman's Park Public School (Mississauga)",


		  "P. L. Robertson Public School (Milton)",


		  "Plum Tree Park Public School (Mississauga)",


		  "Plymouth Public School (Welland)",


		  "Polson Park Public School (Kingston)",


		  "Ponsonby Public School (Guelph)",


		  "Pope John Paul II (Kenora)",


		  "Pope John Paul II Catholic Elementary School (Oakville)",


		  "Pope John Paul II Catholic Elementary School (Kawartha Lakes)",


		  "Pope John Paul II Catholic Elementary School (Kitchener)",


		  "Pope John Paul II Elementary School (Thunder Bay)",


		  "Pope John Paul II Regional Elementary School (Clarence-Rockland)",


		  "Pope John Paul II Separate School (Caledon)",


		  "Pope John Paul II Separate School (Barrie)",


		  "Pope John XXIII Elementary School (Ottawa)",


		  "Pope Paul Catholic School (Toronto)",


		  "Poplar Bank Public School (Newmarket)",


		  "Poplar Road Junior Public School (Toronto)",


		  "Portage Trail Community Junior School (Toronto)",


		  "Portage Trail Community Middle School (Toronto)",


		  "Portage View Public School (Barrie)",


		  "Port Burwell Public School (Bayham)",


		  "Port Dover Elementary Composite School (Norfolk County)",


		  "Port Elgin-Saugeen Central School (Saugeen Shores)",


		  "Port McNicoll Public School (Tay)",


		  "Port Rowan Public School (Norfolk County)",


		  "Port Royal Public School (Toronto)",


		  "Port Stanley Public School (Central Elgin)",


		  "Port Weller Public School (St. Catharines)",


		  "Post's Corners Public School (Oakville)",


		  "Power Glen School (St. Catharines)",


		  "Precious Blood Catholic School (Toronto)",


		  "Precious Blood Separate School (South Huron)",


		  "Presteign Heights Elementary School (Toronto)",


		  "Preston Public School (Cambridge)",


		  "Primrose Elementary School (Shelburne)",


		  "Prince Albert Public School (Scugog)",


		  "Prince Andrew Public School (Burlington)",


		  "Prince Charles Public School (Brantford)",


		  "Prince Charles Public School (South Frontenac)",


		  "Prince Charles Public School (Quinte West)",


		  "Prince Charles Public School (Belleville)",


		  "Prince Charles Public School (London)",


		  "Prince Charles Public School (Newmarket)",


		  "Prince Edward Public School (Windsor)",


		  "Prince of Peace Catholic Elementary School (Georgina)",


		  "Prince of Peace Catholic School (Toronto)",


		  "Prince of Peace Elementary School (Ottawa)",


		  "Prince of Peace School (Essa)",


		  "Prince of Wales Elementary Public School (Hamilton)",


		  "Prince of Wales Public School (Peterborough)",


		  "Prince of Wales Public School (Thorold)",


		  "Prince of Wales Public School (St. Catharines)",


		  "Prince of Wales Public School (Belleville)",


		  "Prince of Wales Public School (Brockville)",


		  "Prince Philip Junior Public School (Hamilton)",


		  "Prince Philip Public School (St. Catharines)",


		  "Prince Philip Public School (Niagara Falls)",


		  "Princess AnneFrench Immersion Public School (London)",


		  "Princess Anne Public School (Greater Sudbury)",


		  "Princess Elizabeth Public School (Brantford)",


		  "Princess Elizabeth Public School (Orangeville)",


		  "Princess Elizabeth Public School (Windsor)",


		  "Princess Elizabeth Public School (London)",


		  "Princess Elizabeth Public School (Welland)",


		  "Princess Margaret Junior School (Toronto)",


		  "Princess Margaret Public School (Orangeville)",


		  "Princess Margaret Public School (Niagara Falls)",


		  "Pringdale Gardens Junior Public School (Toronto)",


		  "Pringle Creek Public School (Whitby)",


		  "Priory Park Public School (Guelph)",


		  "Prueter Public School (Kitchener)",


		  "Quaker Road Public School (Welland)",


		  "Quaker Village Public School (Uxbridge)",


		  "Queen Alexandra Middle School (Toronto)",


		  "Queen Elizabeth II C Public School (Chatham-Kent)",


		  "Queen Elizabeth II P Public School (Petrolia)",


		  "Queen Elizabeth II Public School (Greater Sudbury)",


		  "Queen Elizabeth II School (Sarnia)",


		  "Queen Elizabeth Public School (Kitchener)",


		  "Queen Elizabeth Public School (Leamington)",


		  "Queen Elizabeth Public School (Peterborough)",


		  "Queen Elizabeth Public School (Prince Edward County)",


		  "Queen Elizabeth Public School (Renfrew)",


		  "Queen Elizabeth Public School (Sault Ste. Marie)",


		  "Queen Elizabeth Public School (Quinte West)",


		  "Queen Elizabeth Public School (Belleville)",


		  "Queen Elizabeth Public School (Oshawa)",


		  "Queen Elizabeth Public School (Ottawa)",


		  "Queen Elizabeth Senior Public School (Mississauga)",


		  "Queen Mary Public School (Hamilton)",


		  "Queen Mary Public School (Peterborough)",


		  "Queen Mary Public School (St. Catharines)",


		  "Queen Mary Street Public School (Ottawa)",


		  "Queen of Heaven School (Mississauga)",


		  "Queen of Peace Catholic School (Leamington)",


		  "Queensdale School (Hamilton)",


		  "Queensmount Public School (Kitchener)",


		  "Queen's Rangers Public School (Hamilton)",


		  "Queenston Drive Public School (Mississauga)",


		  "Queen Street Public School (Brampton)",


		  "Queensville Public School (East Gwillimbury)",


		  "Queen Victoria Elementary Public School (Hamilton)",


		  "Queen Victoria Junior Public School (Toronto)",


		  "Queen Victoria Public School (Windsor)",


		  "Queen Victoria Public School (Kawartha Lakes)",


		  "Queen Victoria School (Belleville)",


		  "Quest Alternative School Senior (Toronto)",


		  "Rainham Central School (Haldimand County)",


		  "Rama Central Public School (Severn)",


		  "Ramer Wood Public School (Markham)",


		  "Ranchdale Public School (Toronto)",


		  "Randall Public School (Markham)",


		  "R A Riddell Public School (Hamilton)",


		  "Rawlinson Community School (Toronto)",


		  "Ray Lewis (Elementary) School (Hamilton)",


		  "Ray Underhill Public School (Mississauga)",


		  "Red Lake Madsen Public School (Red Lake)",


		  "Red Maple Public School (Richmond Hill)",


		  "Red Rock Public School (Red Rock)",


		  "Redstone Public School (Richmond Hill)",


		  "Red Willow Public School (Brampton)",


		  "Redwood Acres Public School (Greater Sudbury)",


		  "Reesor Park Public School (Markham)",


		  "Regal Road Junior Public School (Toronto)",


		  "Regency Acres Public School (Aurora)",


		  "Regent Heights Public School (Toronto)",


		  "Regent Park/Duke of York Junior Public School (Toronto)",


		  "Regent Park Public School (Orillia)",


		  "Regina Mundi Catholic School (Toronto)",


		  "Regina Mundi Separate School (Hamilton)",


		  "Regina Street Public School (Ottawa)",


		  "Rene Gordon Elementary School (Toronto)",


		  "Renfrew Collegiate Intermediate School (Renfrew)",


		  "Resurrection School (Brantford)",


		  "R F Downey Public School (Peterborough)",


		  "R Gordon Sinclair Public School (Kingston)",


		  "R H Cornish Public School (Scugog)",


		  "R H McGregor Elementary School (Toronto)",


		  "R. H. Murray Public School (Whitefish)",


		  "Richard Beasley Junior Public School (Hamilton)",


		  "Richmond Public School (Ottawa)",


		  "Richmond Rose Public School (Richmond Hill)",


		  "Richmond Street Public School (Thorold)",


		  "Rick Hansen Public School (London)",


		  "Rickson Ridge Public School (Guelph)",


		  "Rideau Centennial Public School (Rideau Lakes)",


		  "Rideau Heights Public School (Kingston)",


		  "Rideau Intermediate School (Rideau Lakes)",


		  "Rideau Public School (Kingston)",


		  "Rideau Valley Middle School (Ottawa)",


		  "Rideau Vista Public School (Westport)",


		  "Ridgemount Junior Public School (Hamilton)",


		  "Ridgetown DHS-Gr. 7 &amp; 8 (Chatham-Kent)",


		  "Ridgeview Public School (Brampton)",


		  "Ridgeway Public School (Fort Erie)",


		  "Ridgewood Public School (Kawartha Lakes)",


		  "Ridgewood Public School (Mississauga)",


		  "Ridpath Junior Public School (Smith-Ennismore-Lakefield)",


		  "Ripley-Huron Community - Junior Campus School (Huron-Kinloss)",


		  "Rippleton Public School (Toronto)",


		  "Ritson Public School (Oshawa)",


		  "Rivercrest Junior School (Toronto)",


		  "River Heights School (Haldimand County)",


		  "River Heights School (Thames Centre)",


		  "River Oaks Public School (Oakville)",


		  "Riverside Public School (Huntsville)",


		  "Riverside Public School (Mississauga)",


		  "Riverside Public School (London)",


		  "Riverside Public School (Woolwich)",


		  "Riverview Alternative School (Ottawa)",


		  "Riverview Central School (St. Clair)",


		  "Riverview Elementary School (Rainy River)",


		  "River View Public School (Niagara Falls)",


		  "River View Public School (Sault Ste. Marie)",


		  "R J Lang Elementary and Middle School (Toronto)",


		  "R L Beattie Public School (Greater Sudbury)",


		  "R L Graham Public School (Georgina)",


		  "R L Hyslop Elementary School (Hamilton)",


		  "R M Moore Public School (Sault Ste. Marie)",


		  "Robarts/Amethyst Demonstration Elementary School (London)",


		  "Robarts Provincial School for the Deaf (London)",


		  "Roberta Bondar Public School (Ottawa)",


		  "Roberta Bondar Public School (Brampton)",


		  "Robert Baldwin Public School (Milton)",


		  "Robert Bateman Public School (Ottawa)",


		  "Robert E.  Wilson Public School (Ottawa)",


		  "Robert H Lagerquist Senior Public School (Brampton)",


		  "Robert Hopkins Public School (Ottawa)",


		  "Robert J Lee Public School (Brampton)",


		  "Robert Little Public School (Halton Hills)",


		  "Robert Moore Public School (Fort Frances)",


		  "Robert Munsch Public School (Whitby)",


		  "Robert Service Senior Public School (Toronto)",


		  "Roch Carrier Elementary School (Ottawa)",


		  "Roch Carrier French Immersion Public School (Woodstock)",


		  "Rockcliffe Middle School (Toronto)",


		  "Rockcliffe Park Public School (Ottawa)",


		  "Rockford Public School (Toronto)",


		  "Rockhaven School for Exceptional (The North Shore)",


		  "Rockland Public School (Clarence-Rockland)",


		  "Rockway Public School (Kitchener)",


		  "Rockwood Centennial Public School (Guelph/Eramosa)",


		  "Rockwood Public School (Pembroke)",


		  "Roden Public School (Toronto)",


		  "Roger Neilson Public School (Peterborough)",


		  "Rogers Public School (Newmarket)",


		  "Roland Michener Public School (Ajax)",


		  "Roland Michener Public School (Ottawa)",


		  "Rolling Hills Public School (Kawartha Lakes)",


		  "Rolling Meadows Public School (Burlington)",


		  "Rolph Road Elementary School (Toronto)",


		  "Rolph Street Public School (Tillsonburg)",


		  "Romeo Dallaire Public School (Ajax)",


		  "Romeo Public School (Stratford)",


		  "Rose Avenue Junior Public School (Toronto)",


		  "Rosebank Road Public School (Pickering)",


		  "Rosedale Elementary School (Hamilton)",


		  "Rosedale Heights Public School (Thornhill)",


		  "Rosedale Junior Public School (Toronto)",


		  "Rosedale Public School (Sault Ste. Marie)",


		  "Rosedale Public School (Sarnia)",


		  "Roseland Public School (Windsor)",


		  "Roselands Junior Public School (Toronto)",


		  "Roselawn Public School (Richmond Hill)",


		  "Rosemount School (Kitchener)",


		  "Roseneath Centennial Public School (Alnwick-Haldimand)",


		  "Rose Seaton Public School (Fort Erie)",


		  "Rosethorn Junior School (Toronto)",


		  "Roseville Public School (Windsor)",


		  "Ross Doan Public School (Richmond Hill)",


		  "Ross Public School (Welland)",


		  "Ross R MacKay Public School (Erin)",


		  "Rothwell-Osnabruck Elementary School (South Stormont)",


		  "Rouge Valley Public School (Toronto)",


		  "Rousseau Public School (Hamilton)",


		  "Rowntree Public School (Brampton)",


		  "Roxborough Park Junior Public School (Hamilton)",


		  "Roxmore Public School (North Stormont)",


		  "Royal Orchard Middle School (Brampton)",


		  "Royal Roads Public School Public School (Ingersoll)",


		  "Roy H Crosby Public School (Markham)",


		  "Roywood Public School (Toronto)",


		  "R Ross Beattie Senior Public School (Timmins)",


		  "R Tait McKenzie Public School (Mississippi Mills)",


		  "Runnymede Junior and Senior Public School (Toronto)",


		  "Russell D Barber Public School (Brampton)",


		  "Russell Intermediate School (Russell)",


		  "Russell Public Public School (Russell)",


		  "Russell Reid Public School (Brantford)",


		  "Ruth Thompson Middle School (Mississauga)",


		  "Ruthven Public School (Kingsville)",


		  "Ryerson Community School (Toronto)",


		  "Ryerson Heights Elementary School (Brantford)",


		  "Ryerson Middle School (Hamilton)",


		  "Ryerson Public School (Burlington)",


		  "Ryerson Public School (London)",


		  "Ryerson Public School (Cambridge)",


		  "S A Cawker Public School (Scugog)",


		  "Sacred Heart Catholic Elementary School (Lasalle)",


		  "Sacred Heart Catholic Elementary School (Niagara Falls)",


		  "Sacred Heart Catholic Elementary School (Brant)",


		  "Sacred HeartCatholic School (Guelph)",


		  "Sacred Heart Catholic School (Espanola)",


		  "Sacred Heart Catholic School (Marmora And Lake)",


		  "Sacred Heart Catholic School (St. Clair)",


		  "Sacred Heart Catholic School (Frontenac Islands)",


		  "Sacred Heart Catholic School (Quinte West)",


		  "Sacred Heart Catholic School (Kirkland Lake)",


		  "Sacred Heart Catholic School (Sarnia)",


		  "Sacred Heart Catholic School (Toronto)",


		  "Sacred Heart Intermediate School (Ottawa)",


		  "Sacred Heart of Jesus Catholic School (Burlington)",


		  "Sacred Heart of Jesus Separate School (Lanark Highlands)",


		  "Sacred Heart School (South Bruce)",


		  "Sacred Heart School (Timmins)",


		  "Sacred Heart School (Norfolk County)",


		  "Sacred Heart School (Cornwall)",


		  "Sacred Heart School (Midland)",


		  "Sacred Heart Separate School (Hamilton)",


		  "Sacred Heart Separate School (North Middlesex)",


		  "Sacred Heart Separate School (Sioux Lookout)",


		  "Sacred Heart Separate School (Brampton)",


		  "Sacred Heart Separate School (North Huron)",


		  "Sacred Heart Separate School (South Bruce)",


		  "Saginaw Public School (Cambridge)",


		  "Saint Gabriel the Archangel Catholic School (Barrie)",


		  "Saint Mary's School (Huntsville)",


		  "Saint Patrick Separate School (Cobalt)",


		  "Salem Public School (Centre Wellington)",


		  "Sam Chapman Public School (Markham)",


		  "Sam Sherratt Public School (Milton)",


		  "Samuel Hearne Public School (Toronto)",


		  "Sandhills Public School (Kitchener)",


		  "Sandowne Public School (Waterloo)",


		  "Sandwich West Public School (Burlington)",


		  "San Lorenzo Ruiz Catholic Elementary School (Markham)",


		  "San Lorenzo Ruiz Elementary School (Mississauga)",


		  "San Marco Catholic Elementary School (Vaughan)",


		  "Santa Maria Catholic School (Toronto)",


		  "Savant Lake Public School (Savant Lake)",


		  "Sawmill Creek Elementary School (Ottawa)",


		  "Sawmill Valley Public School (Mississauga)",


		  "Scarborough Village Public School (Toronto)",


		  "Schomberg Public School (King)",


		  "Schreiber Public School (Schreiber)",


		  "Schumacher Public School (Timmins)",


		  "Scott Central Public School (Uxbridge)",


		  "Scott Young Public School (Kawartha Lakes)",


		  "Seaforth Public School (Huron East)",


		  "Seaway Intermediate School (South Dundas)",


		  "Second Street Junior Middle School (Toronto)",


		  "Secord Elementary School (Toronto)",


		  "Selby Public School (Greater Napanee)",


		  "Selwyn Elementary School (Toronto)",


		  "Senator Gibson (Lincoln)",


		  "Seneca Central Public School (Toronto)",


		  "Seneca Hill Public School (Toronto)",


		  "Seneca School (Toronto)",


		  "Senhor Santo Cristo Catholic School (Toronto)",


		  "Settler's Green Public School (Mississauga)",


		  "Seventh Street Junior School (Toronto)",


		  "Severn Avenue Public School (Ottawa)",


		  "S Geiger Public School (Massey)",


		  "Shakespeare Public School (Stratford)",


		  "Shanty Bay Public School (Oro-Medonte)",


		  "Sharbot Lake Intermediate School (Central Frontenac)",


		  "Sharbot Lake Public School (Central Frontenac)",


		  "Sharon Public School (East Gwillimbury)",


		  "Shaughnessy Public School (Toronto)",


		  "Shaw Public School (Brampton)",


		  "S H Connor Public School (Tweed)",


		  "Shelter Bay Public School (Mississauga)",


		  "Sheppard Public School (Kitchener)",


		  "Sheppard Public School (Toronto)",


		  "Sherbrooke Public School (Thunder Bay)",


		  "Sheridan Park Public School (St. Catharines)",


		  "Sheridan Park Public School (Mississauga)",


		  "Sheridan Public School (Oakville)",


		  "Sherwood Forest Public School (London)",


		  "Sherwood Mills Public School (Mississauga)",


		  "Sherwood Public School (Madawaska Valley)",


		  "Sherwood Public School (Oshawa)",


		  "Shirley Street Junior Public School (Toronto)",


		  "Shoreham Public School (Toronto)",


		  "Silver Birches Senior School (North Bay)",


		  "Silver Creek Public School (Halton Hills)",


		  "Silver Creek Public School (Mississauga)",


		  "Silverheights Public School (Cambridge)",


		  "Silver Pines Public School (Richmond Hill)",


		  "Silver Springs Public School (Toronto)",


		  "Silver Stream Public School (Richmond Hill)",


		  "Silverthorn Community School (Toronto)",


		  "Silverthorn Public School (Mississauga)",


		  "Simcoe Street Public School (Niagara Falls)",


		  "Sioux Mountain Public School (Sioux Lookout)",


		  "Sioux Narrows Public School (Sioux Narrows Nestor Falls)",


		  "Sir Adam Beck Junior School (Toronto)",


		  "Sir Adam Beck Public School (Wilmot)",


		  "Sir Albert Love Catholic School (Oshawa)",


		  "Sir Alexander Mackenzie Senior Public School (Toronto)",


		  "Sir Arthur Carty Separate School (London)",


		  "Sir Edgar Bauer Catholic Elementary School (Waterloo)",


		  "Sir Ernest Macmillan Public School (Burlington)",


		  "Sir Ernest MacMillan Senior Public School (Toronto)",


		  "Sir George Etienne Cartier Public School (London)",


		  "Sir Isaac Brock Junior Public School (Hamilton)",


		  "Sir Isaac Brock Public School (London)",


		  "Sir Isaac Brock Public School (Guelph)",


		  "Sir James Dunn Public School (Wawa)",


		  "Sir James Whitney Provincial School for the Deaf Elementary (Belleville)",


		  "Sir James Whitney/Sagonaska Elementary School (Belleville)",


		  "Sir John A Macdonald Public School (Pickering)",


		  "Sir John A Macdonald Public School (London)",


		  "Sir John A Macdonald Public School (Belleville)",


		  "Sir John A. Macdonald Senior Public School (Brampton)",


		  "Sir John Moore Community School (St. Clair)",


		  "Sir Richard W Scott Catholic Elementary School (Markham)",


		  "Sir Samuel B Steele Junior Public School (Toronto)",


		  "Sir Samuel Steele Public School (Whitby)",


		  "Sir Wilfrid Laurier Public School (Markham)",


		  "Sir Wilfrid Laurier Public School (Hamilton)",


		  "Sir Wilfrid Laurier Public School (Brampton)",


		  "Sir William Gage Middle School (Brampton)",


		  "Sir William Osler Elementary School (Hamilton)",


		  "Sir William Osler Public School (Bradford West Gwillimbury)",


		  "Sir William Stephenson Public School (Whitby)",


		  "Sir Winston Churchill Elementary School (Thunder Bay)",


		  "Sir Winston Churchill Public School (Belleville)",


		  "Sir Winston Churchill Public School (London)",


		  "Sir Winston Churchill Public School (Brampton)",


		  "Sir Winston Churchill Public School (Ottawa)",


		  "Sister Catherine Donnelly Catholic School (Barrie)",


		  "Sister Mary Clare Catholic School (Sault Ste. Marie)",


		  "Sixteenth Avenue Public School (Richmond Hill)",


		  "S J McLeod Public School (South Glengarry)",


		  "Sloane Public School (Toronto)",


		  "Smithfield Middle School (Toronto)",


		  "Smithfield Public School (Brighton)",


		  "Smith Public School (Grimsby)",


		  "Smithson Public School (Kitchener)",


		  "Smooth Rock Falls Public School (Smooth Rock Falls)",


		  "Somerset Drive Public School (Brampton)",


		  "Sophiasburgh Central Public School (Prince Edward County)",


		  "South Branch Elementary School (North Grenville)",


		  "South Crosby Public School (Rideau Lakes)",


		  "Southdale Public School (Strathroy-Caradoc)",


		  "South Dorchester Public School (Central Elgin)",


		  "South Edwardsburg Public School (Prescott)",


		  "South Grenville Intermediate School (Prescott)",


		  "South March Public School (Ottawa)",


		  "South Monaghan Public School (Otonabee-South Monaghan)",


		  "South Perth Centennial Public School (St. Marys)",


		  "South Plympton Central School (Plympton-Wyoming)",


		  "Southridge Public School (Kitchener)",


		  "South Ridge Public School (Tillsonburg)",


		  "South River Public School (South River)",


		  "South Shore Education Centre (Nipissing)",


		  "Southside Public School (Woodstock)",


		  "Southwold Public School (St. Thomas)",


		  "Southwood Park Public School (Ajax)",


		  "Southwood Public School (Windsor)",


		  "Sparta Public School (Central Elgin)",


		  "Spectrum Alternative Senior School (Toronto)",


		  "Spencer Valley Public School (Hamilton)",


		  "Springbank Public School (Woodstock)",


		  "Springdale Public School (Brampton)",


		  "Springfield Public School (Malahide)",


		  "Springfield Public School (Mississauga)",


		  "Spring Valley Public School (Brighton)",


		  "Sprucecourt Junior Public School (Toronto)",


		  "Sprucedale Public School (Perth East)",


		  "Spruce Glen Public School (Huntsville)",


		  "Spruce Ridge Community School (West Grey)",


		  "St Agatha Catholic Elementary School (Wilmot)",


		  "St Agatha Catholic School (Toronto)",


		  "St Agnes (Hamilton)",


		  "St Agnes Catholic Elementary School (Waterloo)",


		  "St Agnes Catholic School (Chatham-Kent)",


		  "St Agnes Catholic School (Toronto)",


		  "St Agnes of Assisi Catholic Elementary School (Vaughan)",


		  "St Agnes Separate School (Brampton)",


		  "St. Aidan Catholic Elementary School (Brampton)",


		  "St Aidan Catholic School (Toronto)",


		  "St Albert Catholic School (Toronto)",


		  "St Albert of Jerusalem Elementary School (Mississauga)",


		  "St Alexander Catholic Elementary School (Pelham)",


		  "St Alexander Catholic School (Windsor)",


		  "St Alexander Separate School (North Bay)",


		  "St Alfred Catholic Elementary School (St. Catharines)",


		  "St Alfred School (Mississauga)",


		  "St Aloysius Catholic Elementary School (Kitchener)",


		  "St Aloysius School (Stratford)",


		  "St. Alphonsus Catholic Elementary School (Peterborough)",


		  "St Alphonsus Catholic School (Toronto)",


		  "St Ambrose Catholic Elementary School (Cambridge)",


		  "St Ambrose Catholic School (Toronto)",


		  "St Ambrose Separate School (Stratford)",


		  "St. Andre (Toronto)",


		  "St Andrew Catholic Elementary School (Welland)",


		  "St Andrew Catholic Elementary School (Vaughan)",


		  "St Andrew Catholic School (Toronto)",


		  "St Andrew Catholic School (Oakville)",


		  "St Andrew Catholic School (Greater Sudbury)",


		  "St Andrew Elementary School (Ottawa)",


		  "St Andrew School (Orangeville)",


		  "St Andrew's Junior High School (Toronto)",


		  "St Andrews Public School (Toronto)",


		  "St Andrew's Public School (Cambridge)",


		  "St Andrew's Separate School (Killaloe, Hagarty And Richards)",


		  "St Andrew's Separate School (South Stormont)",


		  "St Angela Catholic School (Toronto)",


		  "St Angela Catholic School (Windsor)",


		  "St Angela Merici Catholic Elementary School (Vaughan)",


		  "St Angela Merici Catholic Elementary School (Brampton)",


		  "Stanley Mills Public School (Brampton)",


		  "Stanley Park Public School (Kitchener)",


		  "Stanley Public School (Toronto)",


		  "St Ann (Ancaster) Catholic Elementary School (Hamilton)",


		  "St Ann Catholic Elementary School (Thunder Bay)",


		  "St Ann Catholic Elementary School (St. Catharines)",


		  "St Ann Catholic Elementary School (Pelham)",


		  "St Ann Catholic School (Sault Ste. Marie)",


		  "St Anne Catholic Elementary School (Cambridge)",


		  "St Anne Catholic Elementary School (Kitchener)",


		  "St Anne Catholic Elementary School (Richmond Hill)",


		  "St. Anne Catholic Elementary School (Peterborough)",


		  "St Anne Catholic School (Sarnia)",


		  "St Anne Catholic School (Chatham-Kent)",


		  "St Anne Elementary School (Ottawa)",


		  "St Anne French Immersion Catholic School (Windsor)",


		  "St Anne Separate School (Greater Sudbury)",


		  "St Anne Separate School (Iroquois Falls)",


		  "St Anne Separate School (Brampton)",


		  "St Anne's School (Cornwall)",


		  "St Anne's Separate School (London)",


		  "St. Anne's Separate School (St. Thomas)",


		  "St Anns Separate School (Hamilton)",


		  "St Ann's Separate School (Penetanguishene)",


		  "St Anselm Catholic School (Toronto)",


		  "St Anthony Catholic Elementary School (St. Catharines)",


		  "St Anthony Catholic Elementary School (Thornhill)",


		  "St. Anthony Catholic Elementary School (Port Hope)",


		  "St Anthony Catholic French Immersion School (London)",


		  "St Anthony Catholic School (Essex)",


		  "St Anthony Catholic School (Toronto)",


		  "St Anthony Daniel Catholic School (Pickering)",


		  "St. Anthony Daniel School (Brant)",


		  "St Anthony Elementary School (Ottawa)",


		  "St. Anthony of Padua Catholic Elementary School (Milton)",


		  "St Anthony School (Brampton)",


		  "St Anthony's Separate School (Laurentian Hills)",


		  "St Anthony's Separate School (Kincardine)",


		  "St Antoine Daniel Catholic School (Tay)",


		  "St Antoine Daniel Catholic School (Toronto)",


		  "St Augustine Catholic Elementary School (Cambridge)",


		  "St Augustine Catholic Elementary School (Welland)",


		  "St Augustine Catholic School (Toronto)",


		  "St Augustine Elementary School (Ottawa)",


		  "St Augustines School (Hamilton)",


		  "St Barbara Catholic School (Toronto)",


		  "St. Barbara Elementary School (Mississauga)",


		  "St Barnabas Catholic School (Toronto)",


		  "St Bartholomew Catholic School (Toronto)",


		  "St. Basil Catholic Elementary School (Brantford)",


		  "St Basil Catholic School (White River)",


		  "St Basil School (Mississauga)",


		  "St Basil's Separate School (Owen Sound)",


		  "St Bede Catholic School (Toronto)",


		  "St Benedict Catholic Elementary School (Markham)",


		  "St Benedict Catholic School (Toronto)",


		  "St. Benedict Elementary Catholic School (Greater Sudbury)",


		  "St Benedict Elementary School (Orangeville)",


		  "St Bernadette Catholic Elementary School (Kitchener)",


		  "St Bernadette Catholic School (Ajax)",


		  "St Bernadette Catholic School (Sault Ste. Marie)",


		  "St Bernadette Catholic School (Greater Sudbury)",


		  "St Bernadette Elementary School (Mississauga)",


		  "St Bernadette Elementary School (Barrie)",


		  "St Bernadette's Catholic Elementary School (Georgina)",


		  "St Bernadette School (Hamilton)",


		  "St Bernadette Separate School (London)",


		  "St Bernadette Separate School (Oakville)",


		  "St Bernard Catholic Elementary School (Thunder Bay)",


		  "St Bernard Catholic School (Whitby)",


		  "St Bernard Catholic School (Amherstburg)",


		  "St Bernard Catholic School (Toronto)",


		  "St Bernard Catholic School (Windsor)",


		  "St Bernard Elementary School (Ottawa)",


		  "St. Bernard of Clairvaux Catholic Elementary School (Mississauga)",


		  "St. Bernard of Clairvaux School (Norfolk County)",


		  "St. Bernard School (Brantford)",


		  "St Bernard's Separate School (Orillia)",


		  "St. Bonaventure Catholic Elementary School (Brampton)",


		  "St Bonaventure Catholic School (Toronto)",


		  "St Boniface Catholic Elementary School (Woolwich)",


		  "St Boniface Catholic School (Toronto)",


		  "St Boniface Separate School (Bluewater)",


		  "St Brendan Catholic School (Toronto)",


		  "St Brendan Catholic School (Stouffville)",


		  "St Bridget Catholic School (Whitby)",


		  "St Brigid Catholic Elementary School (Whitchurch-Stouffville)",


		  "St Brigid Catholic Elementary School (North Dumfries)",


		  "St Brigid Catholic School (Toronto)",


		  "St Brigid Elementary School (Ottawa)",


		  "St Brigid School (Brampton)",


		  "St Brigid School (Halton Hills)",


		  "St Brigid Separate School (Greenstone)",


		  "St Brigids Separate School (Hamilton)",


		  "St Bruno Catholic School (Toronto)",


		  "St Carthagh Catholic School (Tweed)",


		  "St Casimir's Catholic School (Killaloe, Hagarty And Richards)",


		  "St. Catherine Catholic Elementary School (Peterborough)",


		  "St Catherine Catholic School (Toronto)",


		  "St Catherine Elementary School (Ottawa)",


		  "St Catherine of Alexandria Elementary School (Halton Hills)",


		  "St Catherine of Siena (London)",


		  "St Catherine of Siena Catholic Elementary School (Vaughan)",


		  "St Catherine of Siena Catholic School (Ajax)",


		  "St Catherine of Siena School (Mississauga)",


		  "St Catherine of Siena School (Barrie)",


		  "St Cecilia Catholic Elementary School (Vaughan)",


		  "St Cecilia Catholic School (Toronto)",


		  "St Cecilia Elementary School (Brampton)",


		  "St. Cecilia's School (Norfolk County)",


		  "St Charles Catholic Elementary School (Thorold)",


		  "St Charles Catholic School (Greater Sudbury)",


		  "St Charles Catholic School (Toronto)",


		  "St Charles Garnier Catholic Elementary School (Richmond Hill)",


		  "St Charles Garnier Catholic School (Toronto)",


		  "St. Charles Garnier School (Mississauga)",


		  "St Charles School (Bradford West Gwillimbury)",


		  "St Charles Separate School (Southwest Middlesex)",


		  "St Christopher Catholic Elementary School (St. Catharines)",


		  "St. Christopher Catholic Elementary School (Burlington)",


		  "St Christopher Catholic School (Greater Sudbury)",


		  "St Christopher Catholic School (Windsor)",


		  "St Christopher Catholic School (Oshawa)",


		  "St Christopher School (Mississauga)",


		  "St Clare Catholic Elementary School (Vaughan)",


		  "St Clare Catholic School (Toronto)",


		  "St Clare Elementary School (Ottawa)",


		  "St Clare of Assisi (Hamilton)",


		  "St Clare School (Mississauga)",


		  "St Clement Catholic Elementary School (Vaughan)",


		  "St Clement Catholic Elementary School (Wellesley)",


		  "St Clement Catholic School (Toronto)",


		  "St Columba Catholic School (Toronto)",


		  "St Columban's Catholic Elementary School (Cornwall)",


		  "St Columban Separate School (Huron East)",


		  "St Columba Separate School (Hamilton)",


		  "St Conrad Catholic School (Toronto)",


		  "St Cornelius School (Caledon)",


		  "St Cyril Catholic School (Toronto)",


		  "St Daniel Catholic Elementary School (Kitchener)",


		  "St Daniel Elementary School (Ottawa)",


		  "St Daniel's School (Hamilton)",


		  "St David Catholic Elementary School (Vaughan)",


		  "St David Catholic School (Greater Sudbury)",


		  "St David of Wales Separate School (Mississauga)",


		  "St David School (Hamilton)",


		  "St David Separate School (Thames Centre)",


		  "St Davids Public School (Niagara-On-The-Lake)",


		  "St Demetrius Catholic School (Toronto)",


		  "St Denis Catholic Elementary School (St. Catharines)",


		  "St Denis Catholic School (Toronto)",


		  "St. Dominic Catholic Elementary School (Kawartha Lakes)",


		  "St Dominic Savio Catholic Elementary School (Kitchener)",


		  "St Dominic Savio Catholic School (Toronto)",


		  "St Dominic Separate School (Mississauga)",


		  "St Dominics Separate School (Oakville)",


		  "St Dorothy Catholic School (Toronto)",


		  "St Dunstan Catholic School (Toronto)",


		  "St Dunstan Elementary School (Mississauga)",


		  "St Edith Stein Elementary School (Mississauga)",


		  "St Edmund Campion Catholic School (Toronto)",


		  "St Edmund Separate School (Mississauga)",


		  "St Edmunds Public School (Northern Bruce Peninsula)",


		  "St. Edward (Toronto)",


		  "St Edward Catholic Elementary School (Lincoln)",


		  "St Edward Catholic Elementary School (Markham)",


		  "St Edward Catholic School (Toronto)",


		  "St Edward School (Nipigon)",


		  "St Edward's School (Westport)",


		  "Steele Street Public School (Barrie)",


		  "Steele Street Public School (Port Colborne)",


		  "Steelesview Public School (Toronto)",


		  "St Elizabeth Ann Seton Elementary School (Ottawa)",


		  "St Elizabeth Catholic Elementary School (Cambridge)",


		  "St Elizabeth Catholic Elementary School (Thunder Bay)",


		  "St Elizabeth Catholic Elementary School (Wainfleet)",


		  "St. Elizabeth Catholic Elementary School (Clarington)",


		  "St Elizabeth Catholic School (Chatham-Kent)",


		  "St Elizabeth Catholic School (Toronto)",


		  "St Elizabeth Elementary School (Ottawa)",


		  "St Elizabeth Seton Catholic Elementary School (Newmarket)",


		  "St Elizabeth Seton Catholic Elementary School (Burlington)",


		  "St Elizabeth Seton Catholic School (Toronto)",


		  "St Elizabeth Seton Catholic School (Pickering)",


		  "St Elizabeth Seton School (Mississauga)",


		  "Stella Maris Catholic School (Amherstburg)",


		  "Stella Maris Catholic School (Toronto)",


		  "St Emily Catholic Elementary School (Vaughan)",


		  "St Emily (Elementary) Separate School (Ottawa)",


		  "Stephen Central Public School (South Huron)",


		  "Stephen G Saywell Public School (Oshawa)",


		  "Stephen Leacock Public School (Ottawa)",


		  "St Eugene Catholic School (Toronto)",


		  "St Eugenes School (Hamilton)",


		  "Steve MacLean Public School (Ottawa)",


		  "Stevensville Public School (Fort Erie)",


		  "Stewart Avenue Public School (Cambridge)",


		  "Stewarttown Middle School (Halton Hills)",


		  "St Faustina Elementary School (Mississauga)",


		  "St Fidelis Catholic School (Toronto)",


		  "St Finnan's Catholic School (North Glengarry)",


		  "St Florence Catholic School (Toronto)",


		  "St. Frances Cabrini School (Norfolk)",


		  "St Francis Catholic Elementary School (Thunder Bay)",


		  "St Francis Catholic Elementary School (Cambridge)",


		  "St Francis Catholic School (Sault Ste. Marie)",


		  "St Francis Catholic School (Greater Sudbury)",


		  "St Francis de Sales Catholic School (Ajax)",


		  "St Francis de Sales Catholic School (Toronto)",


		  "St Francis de Sales Separate School (Smiths Falls)",


		  "St Francis of Assisi Catholic Elementary School (Vaughan)",


		  "St. Francis of Assisi Catholic Elementary School (Clarington)",


		  "St Francis of Assisi Catholic School (Petawawa)",


		  "St Francis of Assisi Catholic School (Guelph)",


		  "St Francis of Assisi Catholic School (Toronto)",


		  "St Francis of Assisi Elementary School (Ottawa)",


		  "St Francis of Assisi Elementary School (Innisfil)",


		  "St Francis of Assisi School (Mississauga)",


		  "St Francis of Assisi Separate School (Halton Hills)",


		  "St Francis School (Blandford-Blenheim)",


		  "St Francis School (London)",


		  "St Francis Separate School (North Bay)",


		  "St Francis Separate School (Fort Frances)",


		  "St. Francis Xavier (7-8) Catholic School (Ottawa)",


		  "St Francis Xavier Catholic Elementary School (Markham)",


		  "St Francis Xavier Catholic School (Toronto)",


		  "St Francis Xavier Elementary School (Clarence-Rockland)",


		  "St Francis Xavier Elementary School (Brampton)",


		  "St Francis Xavier Junior Separate School (Hamilton)",


		  "St Francis Xavier Separate School (Brockville)",


		  "St Gabriel Catholic Catholic School (Toronto)",


		  "St. Gabriel Catholic (Elementary) School (Brantford)",


		  "St Gabriel Catholic School (Windsor)",


		  "St. Gabriel Elementary School (Ottawa)",


		  "St Gabriel Lalemant Catholic Elementary School (Niagara Falls)",


		  "St Gabriel Lalemant Catholic School (Toronto)",


		  "St Gabriel School (Burlington)",


		  "St Gabriel the Archangel Catholic Elementary School (Vaughan)",


		  "St George Catholic Elementary School (Fort Erie)",


		  "St George Elementary School (Ottawa)",


		  "St George-German Public School (Brant)",


		  "St George Separate School (London)",


		  "St George's Junior School (Toronto)",


		  "St Georges Public School (London)",


		  "St George's Separate School (South Stormont)",


		  "St Gerald Catholic School (Toronto)",


		  "St Gerard Majella Catholic School (Toronto)",


		  "St Gerard Separate School (Mississauga)",


		  "St Gertrude School (Mississauga)",


		  "St. Gregory Catholic (Carleton Place)",


		  "St Gregory Catholic Elementary School (Cambridge)",


		  "St Gregory Catholic School (Tecumseh)",


		  "St Gregory Catholic School (Toronto)",


		  "St Gregory Catholic School (Prince Edward County)",


		  "St Gregory Elementary School (Ottawa)",


		  "St Gregory School (Mississauga)",


		  "St Gregory Separate School (Powassan)",


		  "St Gregory the Great Catholic Academy (Vaughan)",


		  "St Hedwig Catholic School (Oshawa)",


		  "St Helen Catholic School (Toronto)",


		  "St Helen Separate School (Mississauga)",


		  "St Henry Catholic Catholic School (Toronto)",


		  "St Herbert School (Mississauga)",


		  "St Hilary Elementary School (Mississauga)",


		  "St Hilary School (Red Rock)",


		  "St Hubert Catholic School (Sault Ste. Marie)",


		  "St Hubert Separate School (North Bay)",


		  "St Ignatius of Loyola Catholic School (Guelph)",


		  "St Ignatius of Loyola Catholic School (Toronto)",


		  "Stilecroft Public School (Toronto)",


		  "Stirling Junior Public School (Stirling-Rawdon)",


		  "Stirling Primary Public School (Stirling-Rawdon)",


		  "Stirling Senior Public School (Stirling-Rawdon)",


		  "St Isaac Jogues Catholic School (Pickering)",


		  "St Isaac Jogues Catholic School (Toronto)",


		  "St Isaac Jogues Elementary School (Brampton)",


		  "St Isidore Elementary School (Ottawa)",


		  "Stittsville Public School (Ottawa)",


		  "St Jacobs Public School (Woolwich)",


		  "St James (Greater Sudbury)",


		  "St James Catholic Elementary School (Vaughan)",


		  "St James Catholic Elementary School (St. Catharines)",


		  "St James Catholic School (Ajax)",


		  "St James Catholic School (Toronto)",


		  "St James Catholic School (Windsor)",


		  "St James Elementary School (Ottawa)",


		  "St James Major (Central Frontenac)",


		  "St James Public School (Thunder Bay)",


		  "St James Separate School (Huron East)",


		  "St James Separate School (New Tecumseth)",


		  "St James Separate School (Bonnechere Valley)",


		  "St James Separate School (Oakville)",


		  "St James the Apostle Separate School (Hamilton)",


		  "St James the Greater Separate School (Smiths Falls)",


		  "St Jane Frances Catholic School (Toronto)",


		  "St Jean Brebeuf Separate School (Brampton)",


		  "St Jean de Brebeuf Catholic School (Toronto)",


		  "St Jean de Brebeuf Separate School (Bradford West Gwillimbury)",


		  "St Jerome Catholic Elementary School (Aurora)",


		  "St Jerome Catholic School (Toronto)",


		  "St Jerome Elementary School (Ottawa)",


		  "St Jerome School (Kirkland Lake)",


		  "St Jerome Separate School (Mississauga)",


		  "St Joachim Catholic School (Toronto)",


		  "St Joachim School (Hamilton)",


		  "St Joachim Separate School (Brampton)",


		  "St Joan of Arc Catholic Elementary School (Oakville)",


		  "St John Bosco Catholic Elementary School (Port Colborne)",


		  "St John Bosco Catholic Elementary School (Vaughan)",


		  "St John Bosco Catholic School (Brockville)",


		  "St John Bosco Catholic School (Oshawa)",


		  "St John Bosco Catholic School (Toronto)",


		  "St John Bosco School (Brampton)",


		  "St John Bosco Separate School (Madawaska Valley)",


		  "St John Brebeuf Catholic School (Erin)",


		  "St John Catholic Elementary School (Kitchener)",


		  "St John Catholic Elementary School (Lincoln)",


		  "St. John Catholic Elementary School (Kawartha Lakes)",


		  "St. John Catholic Elementary School (Peterborough)",


		  "St John Catholic School (Wellington North)",


		  "St John Catholic School (Windsor)",


		  "St John Catholic School (Greater Sudbury)",


		  "St John Catholic School (Toronto)",


		  "St John Catholic School (Guelph)",


		  "St John Catholic School (Sault Ste. Marie)",


		  "St John Chrysostom Catholic Elementary School (Newmarket)",


		  "St John de Brebeuf Catholic School (Kingsville)",


		  "St John Elementary School (Perth)",


		  "St John Fisher Catholic School (Lambton Shores)",


		  "St John Fisher Separate School (Brampton)",


		  "St. John French Immersion School (London)",


		  "St. John Intermediate School (Perth)",


		  "St John of the Cross School (Mississauga)",


		  "St Johns School (Oakville)",


		  "St Johns Separate School (Burlington)",


		  "St John's Separate School (Red Lake)",


		  "St John the Apostle Elementary School (Ottawa)",


		  "St John the Baptist Catholic School (Lakeshore)",


		  "St John the Baptist Elementary School (Caledon)",


		  "St John the Baptist Separate School (Hamilton)",


		  "St John the Evangelist Catholic (Lakeshore)",


		  "St John the Evangelist Catholic School (Toronto)",


		  "St John the Evangelist Catholic School (Whitby)",


		  "St John Vianney Catholic School (Windsor)",


		  "St John Vianney Catholic School (Toronto)",


		  "St John Vianney Separate School (Barrie)",


		  "St Josaphat Catholic School (Toronto)",


		  "St Joseph Catholic Elementary School (Aurora)",


		  "St Joseph Catholic Elementary School (Cambridge)",


		  "St Joseph Catholic Elementary School (Grimsby)",


		  "St Joseph Catholic Elementary School (Fort Erie)",


		  "St Joseph Catholic Elementary School (Markham)",


		  "St Joseph Catholic Elementary School (Richmond Hill)",


		  "St. Joseph Catholic Elementary School (Douro-Dummer)",


		  "St. Joseph Catholic Elementary School (Clarington)",


		  "St. Joseph Catholic Elementary School (Cobourg)",


		  "St JosephCatholic School (Centre Wellington)",


		  "St Joseph Catholic School (Wawa)",


		  "St Joseph Catholic School (Killarney)",


		  "St Joseph Catholic School (Toronto)",


		  "St Joseph Catholic School (Oshawa)",


		  "St Joseph Catholic School (Chatham-Kent)",


		  "St Joseph Catholic School (Belleville)",


		  "St Joseph Catholic School (Uxbridge)",


		  "St Joseph Catholic School (Chatham-Kent)",


		  "St Joseph Catholic School (St. Clair)",


		  "St Joseph Catholic School (Lasalle)",


		  "St Joseph Catholic School (Guelph)",


		  "St. Josephine Bakhita Catholic Elementary School (Brampton)",


		  "St Joseph Intermediate School (Ottawa)",


		  "St Joseph Island Central Public School (St. Joseph)",


		  "St Joseph's Catholic Elementary School (Zorra)",


		  "St Joseph School (Kingston)",


		  "St Joseph School (Brampton)",


		  "St Joseph Separate School (Central Huron)",


		  "St Joseph Separate School (Stratford)",


		  "St Joseph Separate School (Timmins)",


		  "St Joseph Separate School (Mississauga)",


		  "St Joseph Separate School (Greenstone)",


		  "St Joseph's School (Saugeen Shores)",


		  "St Joseph's School (Halton Hills)",


		  "St Joseph's School (Oakville)",


		  "St Joseph's School (Tillsonburg)",


		  "St. Joseph's School (Norfolk)",


		  "St Josephs Separate School (Dryden)",


		  "St Josephs Separate School (Hamilton)",


		  "St Joseph's Separate School (Elizabethtown-Kitley)",


		  "St Joseph's Separate School (Gananoque)",


		  "St Joseph's Separate School (Arnprior)",


		  "St Joseph's Separate School (Greater Madawaska)",


		  "St. Joseph's Separate School (Renfrew)",


		  "St Joseph The Worker Catholic Elementary School (Thornhill)",


		  "St Jude Catholic Elementary School (Thunder Bay)",


		  "St Jude Catholic School (Ajax)",


		  "St Jude Catholic School (Toronto)",


		  "St Jude's Catholic Elementary School (Champlain)",


		  "St Jude School (Mississauga)",


		  "St Jude Separate School (London)",


		  "St Jude's School (Ingersoll)",


		  "St Jules Catholic School (Windsor)",


		  "St Julia Billiart Catholic Elementary School (Markham)",


		  "St Julia Catholic Elementary School (Mississauga)",


		  "St Justin Martyr Catholic Elementary School (Markham)",


		  "St Kevin Catholic Elementary School (Welland)",


		  "St Kevin Catholic School (Toronto)",


		  "St Kevin School (Brampton)",


		  "St Lawrence Catholic School (Toronto)",


		  "St Lawrence Intermediate School (Cornwall)",


		  "St Lawrence's Separate School (Hamilton)",


		  "St Leo Catholic School (Toronto)",


		  "St Leo Catholic School (Whitby)",


		  "St Leonard Elementary School (Ottawa)",


		  "St Leonard School (Brampton)",


		  "St. Leo School (Brantford)",


		  "St Louis Catholic School (Toronto)",


		  "St Louis Catholic School (Leamington)",


		  "St Louis School (Mississauga)",


		  "St Louis Separate School (Kenora)",


		  "St. Lucy Catholic Elementary School (Brampton)",


		  "St Luigi Catholic School (Toronto)",


		  "St Luke Catholic Elementary School (Mississauga)",


		  "St Luke Catholic Elementary School (Waterloo)",


		  "St. Luke Catholic Elementary School (Kawartha Lakes)",


		  "St Luke Catholic School (Toronto)",


		  "St. Luke Catholic School (Smiths Falls)",


		  "St Luke Elementary School (Oakville)",


		  "St Luke (Nepean) Elementary School (Ottawa)",


		  "St Luke (Ottawa) Elementary School (Ottawa)",


		  "St Luke Separate School (Hamilton)",


		  "St. Luke Separate School (North Bay)",


		  "St Luke the Evangelist Catholic School (Whitby)",


		  "St Malachy Catholic School (Toronto)",


		  "St Marcellus Catholic School (Toronto)",


		  "St Margaret Catholic Elementary School (Thunder Bay)",


		  "St Margaret Catholic Elementary School (Cambridge)",


		  "St Margaret Catholic School (Toronto)",


		  "St Margaret Mary Catholic Elementary School (Vaughan)",


		  "St Margaret Mary Separate School (Hamilton)",


		  "St Margaret of Scotland School (Mississauga)",


		  "St Margaret's Public School (Toronto)",


		  "St Marguerite Bourgeoys Catholic Catholic School (Toronto)",


		  "St Marguerite Bourgeoys Catholic School (Pickering)",


		  "St Marguerite Bourgeoys Catholic School (Kingston)",


		  "St Marguerite Bourgeoys Separate School (Brampton)",


		  "St Marguerite d'Youville (London)",


		  "St Marguerite D'Youville Catholic Elementary School (Richmond Hill)",


		  "St Marguerite d'Youville Catholic School (Whitby)",


		  "St Marguerite d'Youville Elementary School (Ottawa)",


		  "St Marguerite d'Youville Elementary School (Oakville)",


		  "St Marguerite d'Youville Elementary School (Hamilton)",


		  "St Marguerite d'Youville Elementary School (Barrie)",


		  "St Maria Goretti Catholic School (Windsor)",


		  "St Maria Goretti Catholic School (Toronto)",


		  "St Maria Goretti Elementary School (Brampton)",


		  "St Mark (London)",


		  "St Mark Catholic Elementary School (Lincoln)",


		  "St Mark Catholic Elementary School (Kitchener)",


		  "St Mark Catholic Elementary School (Whitchurch-Stouffville)",


		  "St Mark Catholic School (Markstay-Warren)",


		  "St Mark Catholic School (Toronto)",


		  "St Mark Catholic School (Sault Ste. Marie)",


		  "St. Mark Catholic School (Prescott)",


		  "St Mark Intermediate School (Ottawa)",


		  "St Mark's Catholic Elementary School (Hamilton)",


		  "St Mark Separate School (Mississauga)",


		  "St Marks Separate School (Burlington)",


		  "St Mark the Evangelist Catholic School (Whitby)",


		  "St Martha Catholic School (Kingston)",


		  "St Martha Catholic School (Toronto)",


		  "St Martin (London)",


		  "St Martin Catholic Elementary School (Thunder Bay)",


		  "St Martin Catholic Elementary School (West Lincoln)",


		  "St. Martin Catholic Elementary School (Smith-Ennismore-Lakefield)",


		  "St Martin Catholic School (Terrace Bay)",


		  "St Martin De Porres Catholic School (Toronto)",


		  "St Martin de Porres Elementary School (Ottawa)",


		  "St Martin of Tours Catholic School (South Algonquin)",


		  "St Martin of Tours Separate School (Hamilton)",


		  "St Mary Catholic (Lakeshore)",


		  "St Mary Catholic Elementary School (Niagara Falls)",


		  "St Mary Catholic Elementary School (King)",


		  "St Mary Catholic Elementary School (Welland)",


		  "St. Mary Catholic Elementary School (Alnwick/Haldimand)",


		  "St. Mary Catholic Elementary School (Kawartha Lakes)",


		  "St. Mary Catholic Elementary School (Trent Hills)",


		  "St Mary Catholic School (Greater Sudbury)",


		  "St Mary Catholic School (Tyendinaga)",


		  "St Mary Catholic School (Quinte West)",


		  "St Mary Catholic School (Centre Wellington)",


		  "St Mary Catholic School (Sables-Spanish Rivers)",


		  "St Mary Catholic School (Wellington North)",


		  "St Mary Catholic School (Toronto)",


		  "St Mary Elementary School (Brampton)",


		  "St Mary (Gloucester) Elementary School (Ottawa)",


		  "St Mary Immaculate Catholic Elementary School (Richmond Hill)",


		  "St Mary of the Angels Catholic Elementary School (Vaughan)",


		  "St Mary of the Angels Catholic School (Toronto)",


		  "St Mary's (West Elgin)",


		  "St Mary's Catholic School (Blind River)",


		  "St Mary School (Stone Mills)",


		  "St Mary School (London)",


		  "St. Mary School (Brantford)",


		  "St. Marys DCVI - Elementary (St. Marys)",


		  "St Mary's French Immersion Catholic School (Sault Ste. Marie)",


		  "St. Mary's School (Haldimand County)",


		  "St Marys Separate School (Goderich)",


		  "St Marys Separate School (Collingwood)",


		  "St Marys Separate School (Barrie)",


		  "St Mary's Separate School (North Perth)",


		  "St Mary's Separate School (Brockville)",


		  "St Mary's Separate School (Carleton Place)",


		  "St Mary's Separate School (Deep River)",


		  "St Mary's Separate School (Killaloe, Hagarty And Richards)",


		  "St Mary's Separate School (North Dundas)",


		  "St Mary-St Cecilia Catholic (South Dundas)",


		  "St Matthew Catholic Elementary School (Hamilton)",


		  "St Matthew Catholic Elementary School (Markham)",


		  "St Matthew Catholic Elementary School (Waterloo)",


		  "St. Matthew Catholic Elementary School (Cornwall)",


		  "St Matthew Catholic School (Toronto)",


		  "St. Matthew Catholic School (Sarnia)",


		  "St Matthew Intermediate School (Ottawa)",


		  "St Matthew Separate School (Mississauga)",


		  "St Matthew's School (Oakville)",


		  "St Matthew the Evangelist Catholic School (Whitby)",


		  "St Matthias Catholic School (Toronto)",


		  "St Maurice Catholic School (Toronto)",


		  "St Michael (London)",


		  "St Michael Catholic Academy (Thornhill)",


		  "St Michael Catholic Elementary School (Niagara-On-The-Lake)",


		  "St Michael Catholic Elementary School (Cambridge)",


		  "St. Michael Catholic Elementary School (Cobourg)",


		  "St Michael Catholic School (Chatham-Kent)",


		  "St Michael Catholic School (Toronto)",


		  "St Michael Catholic School (Sarnia)",


		  "St Michael Catholic School (Guelph)",


		  "St Michael Catholic School (Belleville)",


		  "St Michael (Corkery) Elementary School (Ottawa)",


		  "St Michael Elementary School (North Grenville)",


		  "St Michael Elementary School (Ottawa)",


		  "St Michael (Fitzroy) Elementary School (Ottawa)",


		  "St Michael's (Woodstock)",


		  "St Michaels Catholic Elementary School (Hamilton)",


		  "St Michael's Choir (Jr) School (Toronto)",


		  "St Michaels School (Fort Frances)",


		  "St. Michael's School (Norfolk)",


		  "St. Michael's School (Haldimand)",


		  "St Michaels Separate School (Oakville)",


		  "St Michael's Separate School (Admaston/Bromley)",


		  "St Michael the Archangel Catholic Elementary School (Vaughan)",


		  "St Michael the Archangel Catholic Elementary School (Barrie)",


		  "St Monica Catholic Elementary School (Markham)",


		  "St Monica Catholic School (Toronto)",


		  "St Monica Catholic School (Pickering)",


		  "St Monica Elementary School (Brampton)",


		  "St Monica Elementary School (Ottawa)",


		  "St Monicas Separate School (Barrie)",


		  "St Nicholas Catholic Elementary School (St. Catharines)",


		  "St Nicholas Catholic Elementary School (Newmarket)",


		  "St Nicholas Catholic Elementary School (Waterloo)",


		  "St Nicholas Catholic School (Toronto)",


		  "St Nicholas Elementary School (Caledon)",


		  "St Nicholas of Bari Catholic School (Toronto)",


		  "St Nicholas School (Barrie)",


		  "St Noel Chabanel Catholic Elementary School (Wasaga Beach)",


		  "St Norbert Catholic School (Toronto)",


		  "Stockdale Public School (Quinte West)",


		  "Stonebridge Public School (Markham)",


		  "Stonecrest Elementary School (Ottawa)",


		  "Stonehaven Elementary School (Newmarket)",


		  "Stoneybrook Public School (London)",


		  "Stoney Creek Public School (London)",


		  "Stornoway Crescent Public School (Thornhill)",


		  "Storrington Public School (South Frontenac)",


		  "Stouffville South Central #1 ES (Whitchurch-Stouffville)",


		  "St Padre Pio Catholic Elementary School (Vaughan)",


		  "St Paschal Baylon Catholic School (Toronto)",


		  "St Patrick (Lucan Biddulph)",


		  "St Patrick Catholic Elementary School (Clarence-Rockland)",


		  "St Patrick Catholic Elementary School (King)",


		  "St Patrick Catholic Elementary School (Port Colborne)",


		  "St Patrick Catholic Elementary School (Niagara Falls)",


		  "St Patrick Catholic Elementary School (Markham)",


		  "St. Patrick Catholic Elementary School (Peterborough)",


		  "St Patrick Catholic School (Stone Mills)",


		  "St Patrick Catholic School (Guelph)",


		  "St Patrick Catholic School (Sault Ste. Marie)",


		  "St Patrick Catholic School (Ajax)",


		  "St Patrick Catholic School (South Frontenac)",


		  "St Patrick Catholic School (Kingston)",


		  "St Patrick Elementary School (Ottawa)",


		  "St Patrick's (Woodstock)",


		  "St Patrick's Catholic Elementary School (Hamilton)",


		  "St Patrick School (Brampton)",


		  "St. Patrick School (Brantford)",


		  "St Patrick Separate School (Burlington)",


		  "St Patrick's Intermediate School (Ottawa)",


		  "St Patricks School (Kapuskasing)",


		  "St Patrick's School (Atikokan)",


		  "St. Patrick's School (Haldimand County)",


		  "St Patricks Separate School (Perth South)",


		  "St Patricks Separate School (Huron East)",


		  "St Paul Catholic Elementary School (Kitchener)",


		  "St Paul Catholic Elementary School (Thunder Bay)",


		  "St Paul Catholic Elementary School (Newmarket)",


		  "St. Paul Catholic Elementary School (Asphodel-Norwood)",


		  "St. Paul Catholic Elementary School (Smith-Ennismore-Lakefield)",


		  "St. Paul Catholic Elementary School (Peterborough)",


		  "St Paul Catholic School (Guelph)",


		  "St Paul Catholic School (Kingston)",


		  "St Paul Catholic School (Whitby)",


		  "St Paul Catholic School (Toronto)",


		  "St Paul Catholic School (Sault Ste. Marie)",


		  "St Paul Intermediate School (Ottawa)",


		  "St Paul School (Burlington)",


		  "St Paul Separate School (London)",


		  "St Paul Separate School (Hamilton)",


		  "St Paul Separate School (Timmins)",


		  "St Paul's Separate School (New Tecumseth)",


		  "St Paul the Apostle Catholic School (Greater Sudbury)",


		  "St Peter Canisius Catholic School (Warwick)",


		  "St Peter Catholic Elementary School (St. Catharines)",


		  "St Peter Catholic Elementary School (Cambridge)",


		  "St Peter Catholic Elementary School (Vaughan)",


		  "St Peter Catholic School (Tecumseh)",


		  "St Peter Catholic School (Guelph)",


		  "St Peter Catholic School (Quinte West)",


		  "St Peter Catholic School (Kingston)",


		  "St Peter Intermediate School (Ottawa)",


		  "St. Peter School (Brantford)",


		  "St Peter Separate School (Orangeville)",


		  "St Peters School (Milton)",


		  "St Peter's School (Cornwall)",


		  "St Peter's &amp; St Paul's Separate School (West Grey)",


		  "St Peter the Apostle School (Parry Sound)",


		  "St Philip Catholic School (Petrolia)",


		  "St Philip Elementary School (Ottawa)",


		  "St Philip Elementary School (Mississauga)",


		  "St Philip Neri Catholic School (Toronto)",


		  "St Philomena Catholic Elementary School (Fort Erie)",


		  "St Pio of Pietrelcina Elementary School (Mississauga)",


		  "St Pius X Catholic Elementary School (Thunder Bay)",


		  "St Pius X Catholic School (Toronto)",


		  "St Pius X Catholic School (Sault Ste. Marie)",


		  "St Pius X Catholic School (Tecumseh)",


		  "St Pius X Intermediate School (Ottawa)",


		  "St. Pius X School (Brantford)",


		  "St Pius X Separate School (London)",


		  "Straffordville Public School (Bayham)",


		  "St Raphael Catholic School (Greater Sudbury)",


		  "St Raphael Catholic School (Toronto)",


		  "St Raphael School (Mississauga)",


		  "St Raphaels Separate School (Burlington)",


		  "St Raphael the Archangel Catholic Elementary School (Vaughan)",


		  "Stratford Central Public School (Stratford)",


		  "Stratford Northwestern Public School (Stratford)",


		  "Strathcona Junior Public School (Hamilton)",


		  "St Raymond Catholic School (Toronto)",


		  "St Raymond Elementary School (Mississauga)",


		  "St Rene Goupil Catholic School (Toronto)",


		  "St Rene Goupil-St Luke Catholic Elementary School (Thornhill)",


		  "St Richard Catholic School (Toronto)",


		  "St Richard School (Mississauga)",


		  "St Rita Catholic School (Toronto)",


		  "St Rita Elementary School (Ottawa)",


		  "St Rita Elementary School (Brampton)",


		  "St Rita's School (Woodstock)",


		  "St Robert Catholic School (Toronto)",


		  "St Robert Separate School (London)",


		  "St Roch Catholic School (Toronto)",


		  "St Rose Catholic School (Windsor)",


		  "St Rose of Lima Catholic School (Toronto)",


		  "St. Rose of Lima Elementary School (Ottawa)",


		  "St Rose of Lima Separate School (Mississauga)",


		  "Sts Cosmas and Damian Catholic School (Toronto)",


		  "St Sebastian Catholic Elementary School (Mississauga)",


		  "St Sebastian Catholic School (Toronto)",


		  "St Sebastian Separate School (London)",


		  "St Simon Catholic School (Toronto)",


		  "St Simon Stock Elementary School (Mississauga)",


		  "Sts Martha &amp; Mary Separate School (Mississauga)",


		  "St Sofia School (Mississauga)",


		  "Sts Peter &amp; Paul Separate School (Hamilton)",


		  "Sts. Peter &amp; Paul Separate School (Mississauga)",


		  "St Stephen Catholic Elementary School (Vaughan)",


		  "St. Stephen Catholic Elementary School (Ottawa)",


		  "St Stephen Catholic School (Toronto)",


		  "St Stephen Separate School (Brampton)",


		  "St. Stephen's School (Haldimand County)",


		  "St Sylvester Catholic School (Toronto)",


		  "St Teresa Catholic Elementary School (Kitchener)",


		  "St. Teresa Catholic Elementary School (Peterborough)",


		  "St Teresa Catholic School (Toronto)",


		  "St Teresa of Avila Catholic Elementary School (Woolwich)",


		  "St Teresa of Avila Separate School (Hamilton)",


		  "St Teresa of Avila Separate School (Mississauga)",


		  "St Theresa Catholic Elementary School (St. Catharines)",


		  "St Theresa Catholic School (Essex)",


		  "St Theresa Catholic School (Sault Ste. Marie)",


		  "St Theresa Catholic School (Greater Sudbury)",


		  "St Theresa Catholic School (Whitby)",


		  "St Theresa Elementary School (Ottawa)",


		  "St Theresa School (Callander)",


		  "St. Theresa School (Brantford)",


		  "St Theresa Separate School (London)",


		  "St Theresa Shrine Catholic School (Toronto)",


		  "St Therese Catholic Elementary School (Port Colborne)",


		  "St. Thérèse of Lisieux Catholic Elementary School (Hamilton)",


		  "St Therese of the Child Jesus (Elementary) Separate School (Mississauga)",


		  "St Thomas Aquinas Catholic Elementary School (Thunder Bay)",


		  "St Thomas Aquinas Catholic Elementary School (Georgina)",


		  "St Thomas Aquinas Catholic School (Oshawa)",


		  "St Thomas Aquinas Catholic School (Toronto)",


		  "St. Thomas Aquinas Catholic School (Russell)",


		  "St Thomas Aquinas High School (Kenora)",


		  "St Thomas Catholic Elementary School (Hamilton)",


		  "St Thomas More Catholic Elementary School (Niagara Falls)",


		  "St Thomas More Catholic School (Toronto)",


		  "St Thomas More Catholic School (Kingston)",


		  "St Thomas More Elementary School (Ottawa)",


		  "St Thomas More School (Mississauga)",


		  "St Thomas More Separate School (London)",


		  "St Thomas the Apostle Separate School (Renfrew)",


		  "St Timothy Catholic Elementary School (Kitchener)",


		  "St Timothy Catholic School (Toronto)",


		  "St Timothy School (Mississauga)",


		  "St Timothy Separate School (Burlington)",


		  "Stuart Scott Public School (Newmarket)",


		  "Stuart W Baker Elementary School (Dysart Et Al)",


		  "Sturgeon Creek School (Emo)",


		  "St Ursula Catholic School (Chatham-Kent)",


		  "St Ursula Catholic School (Toronto)",


		  "St Ursula Elementary School (Brampton)",


		  "St Valentine Elementary School (Mississauga)",


		  "St Veronica Catholic Elementary School (Vaughan)",


		  "St Veronica Elementary School (Mississauga)",


		  "St Victor Catholic School (Toronto)",


		  "St Victor Separate School (Mattawa)",


		  "St Vincent Catholic (Chatham-Kent)",


		  "St Vincent Catholic Elementary School (Thunder Bay)",


		  "St Vincent de Paul Catholic Elementary School (Niagara Falls)",


		  "St Vincent de Paul Catholic Elementary School (Cambridge)",


		  "St Vincent de Paul Catholic Elementary School (Markham)",


		  "St Vincent de Paul Catholic School (Toronto)",


		  "St Vincent de Paul Separate School (Strathroy-Caradoc)",


		  "St Vincent de Paul Separate School (Hamilton)",


		  "St Vincent de Paul Separate School (Mississauga)",


		  "St Vincent-Euphrasia Elementary School (Meaford)",


		  "St Vincent's Catholic School (Oakville)",


		  "St Wilfrid Catholic School (Pickering)",


		  "St Wilfrid Catholic School (Toronto)",


		  "St William Catholic School (Lakeshore)",


		  "S T Worden Public School (Clarington)",


		  "Suddaby Public School (Kitchener)",


		  "Sullivan Community School (Chatsworth)",


		  "Summers' Corners Public School (Aylmer)",


		  "Summit Heights Public School (Toronto)",


		  "Summitview Public School (Whitchurch-Stouffville)",


		  "Sunderland Public School (Brock)",


		  "Sundridge Centennial Public School (Sundridge)",


		  "Sunningdale Public School (Oakville)",


		  "Sunnybrae Public School (Innisfil)",


		  "Sunnylea Junior School (Toronto)",


		  "Sunnyside Public School (Kitchener)",


		  "Sunny View Junior and Senior Public School (Toronto)",


		  "Sunny View Middle School (Brampton)",


		  "Sunset Heights Public School (Oshawa)",


		  "Sunset Park Public School (North Bay)",


		  "Superior Heights Community Education (Sault Ste. Marie)",


		  "Superior Heights Intermediate Elementary School (Sault Ste. Marie)",


		  "Susanna Moodie Senior Elementary School (Belleville)",


		  "Sutton Public School (Georgina)",


		  "Swansea Junior and Senior Junior and Senior Public School (Toronto)",


		  "SW Brantford Elem School (Brantford)",


		  "Sweet's Corners Public School (Leeds And The Thousand Islands)",


		  "Sydenham Community School (Owen Sound)",


		  "Sydenham Public School (Kingston)",


		  "Tagwi Intermediate School (North Stormont)",


		  "Tait Street Public School (Cambridge)",


		  "Talbot Trail Public School (Windsor)",


		  "Tam O'Shanter Junior Public School (Toronto)",


		  "Tamworth Elementary School (Stone Mills)",


		  "Tapleytown Public School (Hamilton)",


		  "Tarentorus Public School (Sault Ste. Marie)",


		  "Tavistock Public School (East Zorra-Tavistock)",


		  "Taylor Evans Public School (Guelph)",


		  "Tecumseh Public School (Chatham-Kent)",


		  "Tecumseh Public School (London)",


		  "Tecumseh Public School (Mississauga)",


		  "Tecumseh Public School (Burlington)",


		  "Tecumseh Senior Public School (Toronto)",


		  "Tecumseh Vista Academy - Elementary (Tecumseh)",


		  "Tecumseth Beeton Elementary School (New Tecumseth)",


		  "Tecumseth South Central Public School (New Tecumseth)",


		  "Teeterville Public School (Norfolk)",


		  "Temagami Public School (Temagami)",


		  "Templemead Elementary School (Hamilton)",


		  "Terrace Bay Public School (Terrace Bay)",


		  "Terraview-Willowfield Public School (Toronto)",


		  "Terry Fox Elementary School (Barrie)",


		  "Terry Fox Elementary School (Ottawa)",


		  "Terry Fox Public School (Newmarket)",


		  "Terry Fox Public School (Brampton)",


		  "Terry Fox Public School (Ajax)",


		  "Terry Fox Public School (Cobourg)",


		  "Terry Fox Public School (Toronto)",


		  "Teston Village Public School (Vaughan)",


		  "Thamesford Public School (Zorra)",


		  "Thamesville Area Central Public School (Chatham-Kent)",


		  "The Divine Infant Catholic School (Toronto)",


		  "The Elms Junior Middle School (Toronto)",


		  "The Good Shepherd Catholic School (Barrie)",


		  "The Grove Community School (Toronto)",


		  "The Pines Senior Public School (Clarington)",


		  "The Prince Charles School (Greater Napanee)",


		  "The Queen Elizabeth School (Perth)",


		  "Thessalon Public School (Thessalon)",


		  "The Stewart Public School (Perth)",


		  "The Valleys Senior Public School (Mississauga)",


		  "The Waterfront School (Toronto)",


		  "The Woodlands (Mississauga)",


		  "Thomas D'Arcy McGee Catholic Elementary School (Ottawa)",


		  "Thomas L Wells Public School (Toronto)",


		  "Thomas Street Middle School (Mississauga)",


		  "Thompson Creek Elementary School (Haldimand)",


		  "Thorah Central Public School (Brock)",


		  "Thorncliffe Park Public School (Toronto)",


		  "Thorndale Public School (Brampton)",


		  "Thornhill Public School (Thornhill)",


		  "Thornhill Woods Public School (Thornhill)",


		  "Thorn Lodge Public School (Mississauga)",


		  "Thornwood Public School (Mississauga)",


		  "Thousand Islands Elementary School (Leeds And The Thousand Islands)",


		  "Three Bridges Public School (Woolwich)",


		  "Three Valleys Public School (Toronto)",


		  "Tiger Jeet Singh Public School (Milton)",


		  "Tilbury Area Public School (Chatham-Kent)",


		  "Timberbank Junior Public School (Toronto)",


		  "Timmins Centennial Public School (Timmins)",


		  "Tomken Road Senior Public School (Mississauga)",


		  "Tom Longboat Junior Public School (Toronto)",


		  "Tom Thomson Public School (Burlington)",


		  "Toniata Public School (Brockville)",


		  "Topcliff Public School (Toronto)",


		  "Tosorontio Central Public School (Adjala-Tosorontio)",


		  "Tottenham Public School (New Tecumseth)",


		  "Trafalgar Public School (London)",


		  "Transfiguration of our Lord Catholic School (Toronto)",


		  "Treeline Public School (Brampton)",


		  "Trelawny Public School (Mississauga)",


		  "Trillium Elementary School (Ottawa)",


		  "Trillium Public School (Kitchener)",


		  "Trillium Woods Elementary Public School (Barrie)",


		  "Trillium Woods Public School (Richmond Hill)",


		  "T R McEwen Public School (Oshawa)",


		  "Truedell Public School (Kingston)",


		  "Tumpane Public School (Toronto)",


		  "Turnberry Central Public School (North Huron)",


		  "Tweed-Hungerford Senior Public School (Tweed)",


		  "Tweedsmuir Public School (North Bay)",


		  "Tweedsmuir Public School (London)",


		  "Twentieth Street Junior School (Toronto)",


		  "Tyendinaga Public School (Tyendinaga)",


		  "Tytler Public School (Guelph)",


		  "Unionville Meadows Public School (Markham)",


		  "Unionville Public School (Markham)",


		  "University Heights Public School (London)",


		  "Unnamed Ajax Williamson Catholic Elementary School (Ajax)",


		  "Uplands Catholic Elementary School (Ottawa)",


		  "Upper Thames Elementary School (West Perth)",


		  "Upsala Public School (Upsala)",


		  "Uptergrove Public School (Orillia)",


		  "Usborne Central School (South Huron)",


		  "Uxbridge Public School (Uxbridge)",


		  "Vales South-Fairlawn Blvd Public School ()",


		  "Valley Central Public School (Slate River)",


		  "Valley Farm Public School (Pickering)",


		  "Valleyfield Junior School (Toronto)",


		  "Valley Park Middle School (Toronto)",


		  "Valleyview Central Public School (Middlesex Centre)",


		  "Valley View Public School (Pickering)",


		  "Valley View Public School (Val Caron)",


		  "Valleyview School (Kenora)",


		  "Valley Way Public School (Niagara Falls)",


		  "Vance Chapman Public School (Thunder Bay)",


		  "Vanier Public School (Brockville)",


		  "Vaughan Willard Public School (Pickering)",


		  "Vellore Woods Public School (Vaughan)",


		  "Venerable John Merlini Catholic School (Toronto)",


		  "Venerable Michael McGivney Catholic Elementary School (Brampton)",


		  "Ventura Park Public School (Thornhill)",


		  "Victoria Cross Public School (Wellington North)",


		  "Victoria Harbour Elementary School (Tay)",


		  "Victoria Park Elementary School (Toronto)",


		  "Victoria Public School (Niagara Falls)",


		  "Victoria Public School (Tecumseh)",


		  "Victoria Public School (London)",


		  "Victoria Terrace Public School (Centre Wellington)",


		  "Victoria Village Public School (Toronto)",


		  "Victor Lauriston Public School (Chatham-Kent)",


		  "Victory Public School (Parry Sound)",


		  "Victory Public School (Guelph)",


		  "Village Union Public School (Oshawa)",


		  "Vimy Ridge Public School (Ajax)",


		  "Vincent Massey Public School (Ottawa)",


		  "Vincent Massey Public School (North Bay)",


		  "Vincent Massey Public School (Oshawa)",


		  "Vincent Massey Public School (Clarington)",


		  "Vineland/Maple Grove Public School (Lincoln)",


		  "Viscount Alexander Public School (Cornwall)",


		  "Viscount Alexander Public School (Ottawa)",


		  "Viscount Montgomery Public School (Hamilton)",


		  "Vista Heights Public School (Mississauga)",


		  "V K Greer Memorial Public School (Huntsville)",


		  "V P Carswell Public School (Quinte West)",


		  "Vradenburg Junior Public School (Toronto)",


		  "Walden Public School (Greater Sudbury)",


		  "Walkerton Public School (Brockton)",


		  "Wallace Public School (North Perth)",


		  "Walpole North Elementary School (Haldimand County)",


		  "Walsh Public School (Norfolk)",


		  "Walter E Harris Public School (Oshawa)",


		  "Walter Gretzky Elementary School (Brantford)",


		  "Walter Perry Junior Public School (Toronto)",


		  "Walter Scott Public School (Richmond Hill)",


		  "Walter Zadow Public School (Arnprior)",


		  "Warden Avenue Public School (Toronto)",


		  "Warminster Elementary School (Oro-Medonte)",


		  "Warnica Public School (Barrie)",


		  "Warren Park Junior Public School (Toronto)",


		  "Warsaw Public School (Douro-Dummer)",


		  "Waterford Public School (Norfolk County)",


		  "Watt Public School (Huntsville)",


		  "Waubaushene Elementary School (Tay)",


		  "Waverley Drive Public School (Guelph)",


		  "Waverley Public School (Clarington)",


		  "Waverly Public School (Oshawa)",


		  "W C Little Elementary School (Barrie)",


		  "W Earle Miller Public School (Timmins)",


		  "Webbwood Public School (Sables-Spanish Rivers)",


		  "Wedgewood Junior School (Toronto)",


		  "W.E. Gowling Public School (Ottawa)",


		  "Welborne Avenue Public School (Kingston)",


		  "Wellesley Public School (Wellesley)",


		  "Wellesworth Junior School (Toronto)",


		  "Wellington Elementary Public School (Prescott)",


		  "W. Erskine Johnston Public School (Ottawa)",


		  "Westacres Public School (Mississauga)",


		  "West Bayfield Elementary School (Barrie)",


		  "Westcreek Public School (Pickering)",


		  "Westdale Park Public School (Greater Napanee)",


		  "Westdale Public School (St. Catharines)",


		  "West Elgin Senior Elementary School (West Elgin)",


		  "Westervelts Corners Public School (Brampton)",


		  "West Glen Junior School (Toronto)",


		  "Westheights Public School (Kitchener)",


		  "West Hill Public School (Toronto)",


		  "West Humber Junior Middle School (Toronto)",


		  "West Lynde Public School (Whitby)",


		  "West Lynn Public School (Norfolk)",


		  "Westmeath Public School (Whitewater Region)",


		  "Westminster Central Public School (London)",


		  "Westminster Public School (Thornhill)",


		  "Westminster Public School (Brockville)",


		  "Westminster Woods Public School (Guelph)",


		  "Westmount Avenue Public School (Greater Sudbury)",


		  "Westmount Junior School (Toronto)",


		  "Westmount Public School (Kitchener)",


		  "Westmount Public School (London)",


		  "Westmount Public School (Thorold)",


		  "Westmount Public School (Thunder Bay)",


		  "Westmount Public School (Peterborough)",


		  "Westney Heights Public School (Ajax)",


		  "West Nissouri Public School (Thames Centre)",


		  "West Oak Public School (Oakville)",


		  "West Oaks French Immersion Public School (London)",


		  "Weston Memorial Junior Public School (Toronto)",


		  "West Preparatory Junior Public School (Toronto)",


		  "West Rouge Junior Public School (Toronto)",


		  "Westvale Public School (Waterloo)",


		  "Westview Middle School (Hamilton)",


		  "Westway Junior School (Toronto)",


		  "Westwind Public School (Ottawa)",


		  "Westwood Junior Public School (Hamilton)",


		  "Westwood Middle School (Toronto)",


		  "Westwood Public School (Guelph)",


		  "Wexford Public School (Toronto)",


		  "W H Ballard Public School (Hamilton)",


		  "W H Day Elementary School (Bradford West Gwillimbury)",


		  "Wheatley Area Public School (Chatham-Kent)",


		  "Whitby Shores P.S. Public School (Whitby)",


		  "Whitchurch Highlands Public School (Whitchurch-Stouffville)",


		  "Whitefish Valley Public School (Oliver Paipoonge)",


		  "White Haven Junior Public School (Toronto)",


		  "Whitehorn Public School (Mississauga)",


		  "Whiteoaks Public School (Mississauga)",


		  "White Oaks Public School (London)",


		  "White Pines Intermediate Senior Elementary School (Sault Ste. Marie)",


		  "Whitestone Lake Central School (Whitestone)",


		  "White Woods Public School (West Nipissing)",


		  "Whitney Junior Public School (Toronto)",


		  "Whitney Public School (South Algonquin)",


		  "W H Morden Public School (Oakville)",


		  "W I Dick Middle School (Milton)",


		  "Wilberforce Elementary School (Highlands East)",


		  "Wilberforce Public School (Lucan Biddulph)",


		  "Wilclay Public School (Markham)",


		  "Wilfrid Jury Public School (London)",


		  "Wilkinson Junior Public School (Toronto)",


		  "William Armstrong Public School (Markham)",


		  "William Beatty Public School (Parry Sound)",


		  "William Berczy Public School (Markham)",


		  "William Burgess Elementary School (Toronto)",


		  "William Dunbar Public School (Pickering)",


		  "William E Brown Public School (Wainfleet)",


		  "William G Davis Junior Public School (Toronto)",


		  "William G Davis Public School (Windsor)",


		  "William G Davis Public School (Cambridge)",


		  "William G. Davis Senior Public School (Brampton)",


		  "William G Miller Junior Public School (Toronto)",


		  "William J McCordic School (Toronto)",


		  "Williamsburg Public School (Kitchener)",


		  "Williamsburg Public School (Whitby)",


		  "Williamson Road Junior Public School (Toronto)",


		  "Williams Parkway Senior Public School (Brampton)",


		  "Williamstown Public School (South Glengarry)",


		  "William Tredway Junior Public School (Toronto)",


		  "Willowbrook Public School (Thornhill)",


		  "Willowdale Middle School (Toronto)",


		  "Willow Glen Public School (Mississauga)",


		  "Willow Landing Elementary School (Barrie)",


		  "Willow Park Junior Public School (Toronto)",


		  "Willow Road Public School (Guelph)",


		  "Willow Way Public School (Mississauga)",


		  "Wilmington Elementary School (Toronto)",


		  "Wilshire Elementary School (Thornhill)",


		  "Wilson Avenue Public School (Kitchener)",


		  "Wilton Grove Public School (London)",


		  "Winchester Junior and Senior Public School (Toronto)",


		  "Winchester Public School (North Dundas)",


		  "Winchester Public School (Whitby)",


		  "Winchester Street Public School (Woodstock)",


		  "Windfields Junior High School (Toronto)",


		  "Windham Ridge Public School (Richmond Hill)",


		  "Winger Public School (Wainfleet)",


		  "Wingham Public School (North Huron)",


		  "Winona Drive Senior Public School (Toronto)",


		  "Winona Elementary (Hamilton)",


		  "Winona Elementary School (Hamilton)",


		  "Winston Churchill Public School (Kingston)",


		  "Winston Churchill Public School (Chatham-Kent)",


		  "Winston Churchill Public School (Waterloo)",


		  "Wismer Public School (Markham)",


		  "Withrow Avenue Junior Public School (Toronto)",


		  "W J Baird Public School (Chatham-Kent)",


		  "W J Fricker Senior Public School (North Bay)",


		  "W.J. Holsgrove Public School (Kingston)",


		  "W J Langlois Catholic School (Windsor)",


		  "W J Watson Public School (Georgina)",


		  "Wm Merrifield VC Public School (Sault Ste. Marie)",


		  "Woburn Junior Public School (Toronto)",


		  "Wolford Public School (Merrickville-Wolford)",


		  "W.O. Mitchell Elementary School (Ottawa)",


		  "Woodbine Junior High School (Toronto)",


		  "Woodbridge Public School (Vaughan)",


		  "Woodcrest Public School (Thunder Bay)",


		  "Woodcrest Public School (Oshawa)",


		  "Woodland Heights Public School (London)",


		  "Woodland Park Public School (Cambridge)",


		  "Woodland Public School (St. Catharines)",


		  "Woodland Public School (Thornhill)",


		  "Woodman-Cainsville School (Brantford)",


		  "Woodroffe Avenue Public School (Ottawa)",


		  "Woodville Elementary School (Kawartha Lakes)",


		  "Woodward Junior Public School (Hamilton)",


		  "Worsley Elementary School (Wasaga Beach)",


		  "Worthington Public School (Brampton)",


		  "Wortley Road Public School (London)",


		  "W R Best Memorial Public School (Oro-Medonte)",


		  "W Ross Macdonald Deaf Blind Elementary School (Brantford)",


		  "W Ross Macdonald Provincial School for the Visually Impaired Elementary (Brantford)",


		  "W Sherwood Fox Public School (London)",


		  "W.T. Townshend Public School (Kitchener)",


		  "Wyevale Central Public School (Tiny)",


		  "Wyoming Public School (Plympton-Wyoming)",


		  "Yarker Public School (Stone Mills)",


		  "Yorkhill Elementary School (Thornhill)",


		  "York River PS (Bancroft)",


		  "York River Public School (Bancroft)",


		  "York Street Public School (Ottawa)",


		  "Yorkview Public School (Toronto)",


		  "Yorkview School (Hamilton)",


		  "Yorkwoods Public School (Toronto)",


		  "Zion Heights Junior High School (Toronto)",


		  "Zone Township Central School (Chatham-Kent)",


		  "Zorra Highland Park Public School (Zorra)",


		  "Zurich Public School (Bluewater)",
		];
		
  });
