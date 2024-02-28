import { Equal, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Following } from "../entities/Following";
import { Request, Response } from "express";
import { json } from "stream/consumers";

export default new (class followService {
  private readonly followRepository: Repository<Following> =
    AppDataSource.getRepository(Following);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const userId = res.locals.loginSession.id;
      const type = (req.query.type ?? "") as string;
      const limit = (req.query.limit ?? 0) as number;

      let follow: Following[];
      if (type === "following") {
        follow = await this.followRepository.find({
          where: {
            Follower: {
              id: userId,
            },
          },
          relations: {
            Following: true,
          },
        });
        console.log(follow);

        const mappedData = follow.map((data) => ({
          id: data.id,
          userId: data.Following.id,
          username: data.Following.username,
          fullName: data.Following.fullName,
          email: data.Following.email,
          photo_profile: data.Following.photo_profile,
          bio: data.Following.bio,
          is_following: true,
        }));
        console.log(mappedData);
        return res.status(200).json({ message: "success", data: mappedData });
      } else if (type === "follower") {
        follow = await this.followRepository.find({
          where: {
            Following: {
              id: userId,
            },
          },
          relations: {
            Follower: true,
          },
        });

        console.log(follow);
        const mappedData = await Promise.all(
          follow.map(async (data) => {
            const isFollowed = await this.followRepository.count({
              where: {
                Following: {
                  id: data.Follower.id,
                },
                Follower: {
                  id: userId,
                },
              },
            });

            return {
              id: data.id,
              userId: data.Follower.id,
              username: data.Follower.username,
              email: data.Follower.email,
              photo_profile: data.Follower.photo_profile,
              fullName: data.Follower.fullName,
              bio: data.Follower.bio,
              is_following: isFollowed > 0 ? true : false,
            };
          })
        );
        console.log(mappedData);
        return res.status(200).json({ message: "success", data: mappedData });
      }

      // Handle other cases or return an appropriate response if 'type' is not 'following'
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async follow(req: Request, res: Response): Promise<Response> {
    try {
      const following = req.query.following;
      if (following === res.locals.loginSession.id) {
        return res.status(400).json({
          message:
            "Jangan Ikuti diri sendiri, diri anda saja tidak benar (intropeksi dulu lah)",
        });
      }

      const check = await this.followRepository.countBy({
        Follower: Equal(res.locals.loginSession.id),
        Following: Equal(following),
      });

      if (check) {
        const unFollow = await this.followRepository.delete({
          Follower: {
            id: res.locals.loginSession.id,
          },
          Following: {
            id: Number(following),
          },
        });
        return res.status(400).json({ message: "Success unFollow" });
      } else {
        const follow = await this.followRepository.save({
          Follower: {
            id: res.locals.loginSession.id,
          },
          Following: {
            id: Number(following),
          },
        });
        return res.status(200).json({ message: "follow" });
      }
    } catch {
      return res.status(500).json({ message: "server error" });
    }
  }
  async create(reqBody: any, loginSession: any): Promise<any> {
    try {
      const isFollowExist = await this.followRepository.count({
        where: {
          Following: {
            id: reqBody.following,
          },
          Follower: {
            id: loginSession.id,
          },
        },
      });

      if (isFollowExist > 0) {
        throw new Error("Already follow");
      }

      if (reqBody.following === loginSession.id) {
        throw new Error("You can't follow yourself");
      }

      const follow = this.followRepository.create({
        Follower: {
          id: loginSession.id,
        },
        Following: {
          id: reqBody.following,
        },
      });

      // has delete follow

      const responseFollow = await this.followRepository.save(follow);
      return {
        message: "Success follow",
        data: responseFollow,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async ngefollow(req: Request, res: Response): Promise<Response> {
    const data = req.body;
    data.follower = res.locals.loginSession.id;
    console.log(data.follower);

    const response = await this.followRepository.findOne({
      where: {
        // nama saua adalagbvb aldfag suri zwegta kjw2kwkwk
      },
    });

    // const follow = await this.followRepository.create({
    //   Follower: data.follower,
    //   Following: data.following,
    // });
    // const sayaNgefollow = await this.followRepository.save(follow);
    return res.status(200).json({ message: "follow" });
  }
})();
