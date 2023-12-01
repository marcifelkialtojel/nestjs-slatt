import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as mysql from 'mysql2';
import { ujGyerekDto } from './ujGyerekDto';

const conn = mysql
  .createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mikulas',
  })
  .promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    /*const eredmeny = await conn.execute(
      'SELECT id, nev, jo, ajandek FROM gyerekek',
    );
    const adatok = eredmeny[0];
    const mezok = eredmeny[1];
    console.log(adatok);
    console.log(mezok);
    */
    const [adatok, mezok] = await conn.execute(
      'SELECT id, nev, jo, ajandek FROM gyerekek',
    );
    console.log(adatok);
    console.log(mezok);

    return {
      gyerekek: adatok,
    };
  }
  @Get('/gyerekek/:id')
  async egyGyerek(@Param('id') id: number) {
    const [adatok] = await conn.execute(
      'SELECT id, nev, jo, ajandek FROM gyerekek WHERE id = ?',
      [id],
    );
    return adatok[0];
  }

  @Get('/ujGyerek')
  @Render('ujgyerek')
  ujGyerekForm(){
    //...
  }

  @Post('/ujGyerek')
  async ujGyerek(@Body() ujGyerek: ujGyerekDto) {
    const nev = ujGyerek.nev;
    const jo: boolean = ujGyerek.jo == '1';
    const ajandek = jo ? ujGyerek.ajandek : null;
    const adatok = await conn.execute(
      'INSERT INTO gyerekek (nev, jo, ajandek) VALUES (?, ?, ?)',
      [nev, jo, ajandek],
    );
    console.log(adatok);
    return {};
  }
}
