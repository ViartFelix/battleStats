import 'dart:convert';
import 'dart:io';

import 'package:interact/interact.dart';
import 'package:postgres/postgres.dart';

void main(List<String> arguments) async {
  Process.runSync("chcp", ["65001"], runInShell: true);  // Or the async version Process.run

  var connection=PostgreSQLConnection("127.0.0.1", 5432, "battle_stats_db", username: "postgres", password: "admin");
  await connection.open();

  final optionsDB=['create table','delete table','refresh tables','seed table','migrate:fresh','migrate:fresh->db:seed','db:seed','Refresh domains','Annuler'];

  //Sélection de l'action
  final selection=Select(
    prompt: 'Que faire?',
    options: optionsDB,
    initialIndex: 0,
  ).interact();

  switch (selection) {
      //create table
      case 0:
        final optionsTablesBase=['Toutes','units','units_stats','species','users','slots','slots_users','(Vide)','Annuler'];

        final selectOption=Select(
          prompt: "Sélectionnez un schéma ou créer un table vide",
          options: optionsTablesBase,
          initialIndex: 0,
        ).interact();

        var el=optionsTablesBase[selectOption];

        //Si selectionné un modèle par défaut
        if(selectOption<optionsTablesBase.length-2 && selection>0) {
          await createTable(connection,el);
        }
        //Si selectionné tout
        else if(selection==0) {
          final optionsAllTables=['units','units_stats','species','users','slots','slots_users'];

          for(var singleOption in optionsAllTables) {
            await createTable(connection,singleOption);
          }
        }
        //Si selectionné un modèle vide
        else if(selection==optionsTablesBase.length-2) {
          await createTable(connection,Input(prompt: "Nom de la table").interact());
        }
        break;



      
      //delete table
      case 1:
        var query=await connection.query("SELECT * FROM information_schema.tables WHERE table_schema = 'public'");

        List<String> allTables=['Toutes'];

        for(var row in query) {
          allTables.add(row[2]);
        }

        allTables.add('Annuler');

        final selection=Select(
          prompt: 'Quelle table à supprimer?',
          options: allTables,
          initialIndex: 0,
        ).interact();

        String selected=allTables[selection];

        //Si toutes les tables
        if(selection==0) {
          /*
          for(var singleOption in allTables.sublist(1,allTables.length-2)) {
            await deleteTable(connection,singleOption);
          }
          */
          await connection.query("DROP SCHEMA public CASCADE;");
          await connection.query("SCHEMA public;");
        }
        //Si cliqué sur une des tables
        else if(selection!=allTables.length-1 && selection!=0) {
          await connection.query("DROP TABLE $selected");
        }
        //Si cliqué sur annuler
        else {
          print("Anulation de la supression de table");
        }

        await connection.close();
        break;




      //refresh table (supprimer la table et seeder)
      case 2:
        
        
        /*
        var query=await connection.query("SELECT * FROM information_schema.tables WHERE table_schema = 'public'");

        for(var row in query) {
          await connection.query("TRUNCATE TABLE $row[2] CASCADE;");
        }
        */
        break;




      //seed table (ajouter les données à la table)
      case 3:
        
        break;




      //migrate:fresh (supprimer toutes les tables et les recréer sans données)
      case 4:
        
        break;




      //migrate:fresh->db:seed (supprimer toutes les tables, les recréer sans données et les seeder)
      case 5:
        try {
          await connection.query("DROP SCHEMA public CASCADE");
          await connection.query("CREATE SCHEMA public;");

          print("Tables recréées.");
          
          final optionsAllTables=['units','units_stats','species','users','slots','slots_users'];

          for(var singleOption in optionsAllTables) {
            await createTable(connection,singleOption);
          }

          await dbSeed(connection);
        } catch(e) {
          print(e);
        }
        break;




      //db:seed (seeder toutes les tables)
      case 6:
        await dbSeed(connection);
        break;




      //Rien
      default:
        break;
    }

  await connection.close();

  //Exit du programme sinon il tourne à l'infini
  exit(0);
}

Future<bool> dbSeed(PostgreSQLConnection con) async {
  try {
    //Current directory path
    final String path=Directory.current.path;

    //Fetch of the json file and make it a string
    final String dataFetched=File("$path\\lib\\data.json").readAsStringSync();

    //Decoding the json file into Map<String, dynamic>
    List data=jsonDecode(dataFetched);

    print('Seed en cours...');


    int idUnit=1;
    int idUnitStat=1;

    int idSpecie=1;

    int lenData=data.length;
    //Looping in the data.json file
    for(var singleSpecie in data) {
      //print(singleSpecie);
      stdout.write("\r$idSpecie / $lenData");
      List<int> lastUnitsIDs=[];

      //int specieForms=singleSpecie.length;

      for(var singleUnit in singleSpecie) {
        //Accéder aux propriétées de l'unitée: singleUnit["(param)"]
        //Remplacement de ' -> '' car sur postgrès, les single quotes ne marchent pas, il faut mettre des quotes pour insérer un string (une seule paire par string et non pas deux des deux côtées)
        String name=singleUnit["name"].replaceAll("'","''");
        dynamic rarity=singleUnit["rarity"];
        dynamic level=singleUnit["level_stat"];


        rarity ??= 5;

        try {
          await con.query("INSERT INTO units(id_unit,name,rarity,role,lvl_stat) VALUES ($idUnit,'$name',$rarity,'ukn',$level)");
        } catch(e) {
          print(e);
        }

        List<String> generalAbilitiesHandler=[];

        //Assignation à une valeur de base car on ne sait jamais
        List<int>effectiveRange=[0,singleUnit["stats"]["range"]];

        for(var ability in singleUnit["general_abilities"]) {

          List<String>bannedAbilities=['effe','long','prot','shiel','wav','sto','attack','omni','performs','inflicts','multi'];

          //Si les general abilities contiennent une effctive range
          if(ability.contains('|')) {
            //On split en deux la capacitées et la range
            String effRange=ability.split('|')[1];
            List<String> allRanges=effRange.split(', ');

            int minValue=9999;
            int maxValue=-9999;

            for(var singleRangeGroup in allRanges) {

              var allSingleRanges=singleRangeGroup.split(',');

              for(var singleRange in allSingleRanges) {
                var splitedRange=singleRange.split('-');
                //Si le premier chiffre est négatif
                if(splitedRange[0].isEmpty) {
                  -int.parse(splitedRange[1])<minValue ? minValue=-int.parse(splitedRange[1]) : false;
                  int.parse(splitedRange[2])>maxValue ? maxValue=int.parse(splitedRange[2]) : false;
                }
                //Si le premier chiffre est positif
                else {
                  int.parse(splitedRange[0])<minValue ? minValue=int.parse(splitedRange[0]) : false;
                  int.parse(splitedRange[1])>maxValue ? maxValue=int.parse(splitedRange[1]) : false;
                }
              }
            }

            effectiveRange=[minValue,maxValue];

          }

          bool isOK=true;

          for (var bannedAbility in bannedAbilities) {
            if(ability.startsWith(bannedAbility)) {

              if(ability.contains('omni') || ability.startsWith('long')) {
                generalAbilitiesHandler.add(ability.split('|')[0].toLowerCase().replaceAll(' ','_'));
              } else if(ability.startsWith('attacks only')) {
                generalAbilitiesHandler.add('attack_only');
              } else if(ability.contains('consecutively')) {
                //generalAbilitiesHandler.add('multi-hit');
              } else if(ability.contains('multi-hit')) {
                generalAbilitiesHandler.add('multi-hit');
              } else if(ability.startsWith('eva ')) {
                generalAbilitiesHandler.add('eva_killer');
              }
              isOK=false;
            }
          }


          isOK==true ? generalAbilitiesHandler.add(ability.toLowerCase().replaceAll(' ','_')) : false;
        }


        List<String> traitsAbilitiesHandler=[];

        for(var singleAbilityTrait in singleUnit["abilities_trait"]) {
          if(singleAbilityTrait.contains('attack') && singleAbilityTrait.contains(' only ')) {
            traitsAbilitiesHandler.add('attack_only');
          } else if(singleAbilityTrait.contains('attack')) {
            traitsAbilitiesHandler.add('resists');
          } else {
            traitsAbilitiesHandler.add(singleAbilityTrait.toLowerCase().replaceAll(' ','_'));
          }
        }
        
        String generalAbilities=jsonEncode(generalAbilitiesHandler).replaceAll('"', "'");

        List<String>traitsHandler=[];

        for (var singleTrait in singleUnit["traits"]) {
          singleTrait=="white" ? traitsHandler.add("traitless") : traitsHandler.add(singleTrait);
        }
        
        if(singleUnit["traits"].length<=0 && traitsAbilitiesHandler.isNotEmpty) {
          List<String>allTraits=["red","black","floating","metal","angel","alien","zombie","aku","relic","traitless"];

          for (var singleTrait in allTraits) {
            traitsHandler.add(singleTrait);
          }
        }

        String traitAbilities=jsonEncode(traitsAbilitiesHandler).replaceAll('"', "'");
        String immuneTo=jsonEncode(singleUnit["immune_to"]).replaceAll('"', "'");
        String traitsAll=jsonEncode(traitsHandler).replaceAll('"', "'");


        int cost=singleUnit["cost"];
        int dmg=singleUnit["stats"]["dmg"];
        int hp=singleUnit["stats"]["hp"];
        int range=singleUnit["stats"]["range"];
        String atkType=singleUnit["target"];

        double tba=singleUnit["times"]["tba"].toDouble();
        double atkAnim=singleUnit["times"]["anim_atk"].toDouble();
        double recharge=singleUnit["times"]["recharge"].toDouble();

        
        try {
          await con.query('''
          INSERT INTO units_stats
          (id_unit_stat,id_unit,
          target,target_abilities,general_abilities,immune_to,
          cost,dmg,hp,range,effective_range,atk_type,
          atk_tba,atk_animation,recharge)
          VALUES
          ($idUnitStat,$idUnit,
          ARRAY$traitsAll::TEXT[],ARRAY$traitAbilities::TEXT[],ARRAY$generalAbilities::TEXT[],ARRAY$immuneTo::TEXT[],
          $cost,$dmg,$hp,$range,ARRAY$effectiveRange::INT[],'$atkType',
          $tba,$atkAnim,$recharge
          );
          ''');
        } catch(e) {
          print(e);
        }

        lastUnitsIDs.add(idUnit);

        
        idUnit++;
        idUnitStat++;

      }

      try {
        await con.query('''
        INSERT INTO species
        (id_specie,id_all_units)
        VALUES
        ($idSpecie,ARRAY$lastUnitsIDs::INT[])
        ''');
      } catch(e) {
        print(e);
      }
      

      idSpecie++;
    }

    print("\nSeed complété.");
    return true;
  } on Exception catch(e) {
    print(e);
    return false;
  } catch(e) {
    print(e);
    return false;
  } finally {
    //await con.close();
  }
}

String getBaseBluePrints(table) {

  String toReturn="";

  switch (table) {
    case "units":
      toReturn='''
        id_unit smallint primary key,
        name text,
        rarity smallserial,
        role text,
        lvl_stat smallserial
      ''';
      break;
    case "units_stats":
      toReturn='''
        id_unit_stat smallint primary key,
        id_unit smallint references units(id_unit),
        target text[],
        target_abilities text[],
        general_abilities text[],
        immune_to text[],
        cost smallint,
        dmg integer,
        hp integer,
        range smallint,
        effective_range smallint[],
        atk_type varchar(20),
        atk_tba smallint,
        atk_animation smallint,
        recharge smallint
      ''';
      break;

    case "species":
      toReturn='''
        id_specie smallint primary key,
        id_all_units smallint[]
      ''';
      break;

    case "users":
      toReturn='''
        id_user smallint primary key,
        username varchar(80),
        email text,
        password text,
        registered_at date
      ''';
      break;

    case "slots":
      toReturn='''
        id_slot smallint primary key,
        units_ids smallint[][],
        created_at date
      ''';
    break;

    case "slots_users":
      toReturn='''
        id_slot_user smallint primary key,
        id_slot smallint references slots(id_slot),
        id_user smallint references users(id_user),
        name varchar(80),
        cannon smallint
      ''';
    break;

    default:
      toReturn='''id_$table smallint primary key''';
      break;
  }

  return toReturn;
}

Future<bool> createTable(PostgreSQLConnection connection, String name) async {
  try {
    var schema=getBaseBluePrints(name).replaceAll(RegExp(' +'), ' ');
    await connection.query("CREATE TABLE $name ($schema)");

    print('Table $name créée.');
    return true;
  }
  
  on Exception catch(e) {
    print('Création de la table $name raté.');
    print(e);
    return false;
  }
  
  catch(e) {
    print('Création de la table $name raté.');
    print(e);
    return false;
  }
  
  finally {
    //await connection.close();
  }
}

Future<bool> deleteTable(PostgreSQLConnection connection, String table) async {
  try {
    await connection.query("TRUNCATE TABLE $table CASCADE;");
    await connection.query("DROP TABLE $table");
    print("Table $table suprimée");
    return true;
  } on Exception catch(e) {
    print(e);
    return false;
  } finally {
    //await connection.close();
  }
  
}