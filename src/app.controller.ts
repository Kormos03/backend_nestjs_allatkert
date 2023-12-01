import { Controller, Get, Param, Render, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import * as mysql from 'mysql2';
import { UjAllatDTO } from './ujAllatDTO';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mypassword',
  database: 'allatkert',
  port: 3306,
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  async index() {
    const [adatok, mezok] = await connection.execute('SELECT id, kor, nev, fajta FROM allatok');
    return { allatok: adatok }
  }

  @Get('/allatok/:id')
  async allat(@Param('id') id: number) {
    const [datas] = await connection.execute('SELECT id, kor, nev, fajta WHERE nev = ?', [id])
    return datas[0];
  }

  @Get('/urlap')
  @Render('urlap')
  async urlapForm() { }

  @Post('/urlap')
  async urlap(@Body() ujallat: UjAllatDTO) {
    const nev: string = ujallat.nev;
    const fajta: string = ujallat.fajta;
    console.log(fajta)
    const kor: number = parseInt(ujallat.kor);
    console.log(ujallat)
    // const [datas] = await connection.execute('INSERT INTO allatok (kor, nev, fajta) VALUES (?, ?, ?)', [kor, nev, fajta])
    if (isNaN(kor) || kor < 1) {
      // Handle the case where 'kor' is not a valid number or less than 1
      return { error: 'Invalid age value' };
    }

    // Check if 'nev' and 'fajta' are defined before executing the query
    if (nev !== undefined && fajta !== undefined) {
      const [datas] = await connection.execute(
        'INSERT INTO allatok (kor, nev, fajta) VALUES (?, ?, ?)',
        [kor, nev, fajta]
      );

      // Handle the result if needed
      return { message: 'Record inserted successfully' };
    } else if (nev == undefined) {
      // Handle the case where 'nev' or 'fajta' is undefined
      return { error: 'Name is missing' };
    }
    else { return { error: 'Type is missing' }; }
  }
}
